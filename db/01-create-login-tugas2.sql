-- Login buat tugas 2 
USE master;
GO

IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = 'hilma')
BEGIN
    CREATE LOGIN hilma
        WITH PASSWORD = N'Hilma_Tugas2026!',
             DEFAULT_DATABASE = review_kantin;
END
GO

USE review_kantin;
GO

IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = 'hilma')
BEGIN
    CREATE USER hilma FOR LOGIN hilma;
END
GO

ALTER ROLE db_datareader ADD MEMBER hilma;
ALTER ROLE db_datawriter ADD MEMBER hilma;
GO

SELECT name, type_desc, authentication_type_desc
FROM sys.database_principals
WHERE name = 'hilma';
GO
