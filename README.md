# Query API for Schemestack
## A Complete Refactor

The Node.js based backend for Scheme has been completely rewritten using ES6 classes and Javascript best practices.

Building off of the original API, the newer version is now multi-threaded, utilizing the node cluster library to create a distributed Coordinator/Worker based architecture. 

The backend now supports multiple datasources, up from just PrestoDB on the original. There is now support for MariaDB/MySQL, TrinoDB, PrestoDB, Amazon Athena, with MongoDB support on the way. 

Besides being run purely with Node.js, the API still has docker support and can be accessed on port 5679.