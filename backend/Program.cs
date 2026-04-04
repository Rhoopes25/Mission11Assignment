// These "using" statements import the namespaces we need
// Like import statements in React/TypeScript
using Bookstore.API.Data;
using Microsoft.EntityFrameworkCore;

// Creates the app builder - this is the starting point for every ASP.NET app
var builder = WebApplication.CreateBuilder(args);

// Tells the app we're using controllers 
builder.Services.AddControllers();

// These two lines enable Swagger - a built-in tool to test your API in the browser
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Registers the database context with dependency injection
// It reads the connection string "BookstoreConnection" from appsettings.json
// This is what makes _context available in our controller later
builder.Services.AddDbContext<BookstoreDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("BookstoreConnection")));

// Sets up CORS (Cross-Origin Resource Sharing)
// Without this, the browser blocks React from talking to the backend
// because they run on different ports (3000 vs 5000)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
        policy.WithOrigins(
            "http://localhost:3000",
            "http://localhost:5173",
            "https://witty-island-075340d0f.2.azurestaticapps.net",
            "https://witty-island-075340d0f-preview.eastus2.2.azurestaticapps.net"
        )
              .AllowAnyHeader()
              .AllowAnyMethod());
});
// Builds the actual app from all the services we registered above
var app = builder.Build();

// Only show Swagger in development mode, not in production
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Activates the CORS policy we defined above
app.UseCors("AllowReact");

// Enables authorization (we're not using login/auth but it's good practice to include)
app.UseAuthorization();

// Tells the app to route incoming requests to the right controller
app.MapControllers();

// Starts the server and keeps it running
app.Run();