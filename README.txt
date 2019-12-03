Project uses ANGULAR UNIVERSAL for server side page rendering, allowing for better SEO.
To run: npm run build:ssr && npm run serve:ssr
To run live development reload: above step + ng serve, make sure environment.apiUrl = localhost:3000 (port of node server)

Server code contains API Endpoints for application content to read/write to Azure SQL db instance