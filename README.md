# Sample Database
A set of database scripts and files containing the same set of tables and data (as much as reasonably possible). This 
makes these perfect for testing data-storage operations, especially across engines or drivers, or just performaning
basic tests that need to interact with a data source. 

## Goals
- Remain small and simple.
- No changes to schema or data over time. Unit tests based on this schema and data should be able to rely on the
  exising configuration long-term.
- Support as many data table-oriented file formats and database engines as reasonably possible.

## Supported Databases & Files
The goal of the project is to support a wide array of data file and database formats.
### Databases
Database scripts do not include any "create database" operations (unless required). You will need to create a database
first and then run the appropriate script to create the schema and data.

- [SQLite 3](./SQLite)
- ~~[MySQL 7+](./MySQL)~~ Coming soon.
- ~~[Postgres 8+](./Postgres)~~ Coming soon.
- [Microsoft SQL Server](./Microsoft%20SQL%20Server)
- [Microsoft Access](./Microsoft%20Office/Access)

### File Formats
- [CSV](./Flat/CSV/)
- [JSON](./Flat/JSON)
- [Markdown](./Flat/Markdown)
- [Microsoft Excel](./Microsoft%20Office/Excel)
- [Open Document Spreadsheet](./Open%20Document%20Format)
- [TOML](./Flat/TOML)
- [TSV](./Flat/TSV)
- [YAML](./Flat/YAML)
- [XML](./Flat/XML)

## Architecture
This architecture is intentionally kept simple - we are not considering stored procedures or functions.

Some database engines or file formats may not support all features (like views) - in such case we will use a similar feature,
if possible, to create a similar result. Not all column contraints or features may be supported by all file formats.

### Column Features
Certain tables utilize a "DateDeleted" DateTime column - this column acts as a "soft-delete" flag for the record. 
Whether this is great architecture or not typically depends on your needs, but because it's often used we're including
it on the following tables: Customers, Products, and Users.

In file-based formats, where a column is a Binary data type, we will use a base-64 encoded string.

Databases will use foreign-key constraints, indexes, and primary-keys whenever possible.

### Dataset
1. #### [Addresses](./Flat/Markdown/Addresses.md)    
    ##### Rows: 1000
    ##### Columns:
    1. ID: Integer, auto-increments, not null.
    1. Line1: String, not null.
    1. Line2: String.
    1. City: String.
    1. PostalCode: String.
    1. StateProvince: String.
    1. Country: String.
    1. Latitude: Float.
    1. Longitude: Float.
1. #### [Customers](./Flat/Markdown/Customers.md)    
    ##### Rows: 1000
    ##### Columns:
    1. ID: Integer, auto-increments, not null.
    1. FirstName: String, not null.
    1. LastName: String, not null.
    1. CompanyName: String.
    1. Title: String.
    1. Notes: String.
    1. AccountNumber: Integer.
    1. Photo: Binary.
    1. DateCreated: DateTime, not null.
    1. DateUpdated: DateTime.
    1. DateDeleted: DateTime.
1. #### [Orders](./Flat/Markdown/Orders.md)    
    ##### Rows: 1500
    ##### Columns:
    1. ID: Integer, auto-increments, not null.
    1. CustomerID: Integer, foreign-key.
    1. AddressID: Integer, foreign-key.
    1. Status: String, not null.
    1. PaymentMethod: String.
    1. Weight: Float.
    1. Shipped: Boolean.
    1. TrackingNumber: String.
    1. DateShipped: Date.
    1. TimeShipped: Time.
1. #### [OrderProducts](./Flat/Markdown/OrderProducts.md)    
    ##### Rows: 3000
    ##### Columns:
    1. OrderID: Integer, foreign-key.
    1. ProductID: Integer, foreign-key.
    1. Quantity: Integer, not null.
    1. UnitCost: Float, not null.
    1. UnitPrice: Float, not null.
    1. TotalCost: Float, not null.
    1. TotalPrice: Float, not null.
1. #### [Products](./Flat/Markdown/Products.md)    
    ##### Rows: 1000
    ##### Columns:
    1. ID: Integer, auto-increments, not null.
    1. Name: String, not null.
    1. ScanCode: String.
    1. Cost: Float, not null.
    1. Price: Float, not null.
    1. ImageURL: String.
    1. DateCreated: DateTime, not null.
    1. DateUpdated: DateTime.
    1. DateDeleted: DateTime.
1. #### [Users](./Flat/Markdown/Users.md)    
    ##### Rows: 200
    ##### Columns:
    1. ID: Integer, auto-increments, not null.
    1. RoleID: Integer, foreign-key.
    1. UserName: String, not null.
    1. Password: String, not null.   
        *Note:* Passwords are stored as the [SHA1](https://en.wikipedia.org/wiki/SHA-1) hash digest of "password" concatenated with the row ID (e.g.: "password33" on a user with ID 33)
    1. DateCreated: DateTime, not null.
    1. DateUpdated: DateTime.
    1. DateDeleted: DateTime.
1. #### [Roles](./Flat/Markdown/Roles.md)    
    ##### Rows: 10
    ##### Columns:
    1. ID: Integer, auto-increments, not null.
    1. Name: String, not null.

## Contributing
Want to provide a fix or new file? Just create a merge request with the change. Simple as that.