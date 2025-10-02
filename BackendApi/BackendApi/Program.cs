using BackendApi.Data;
using BackendApi.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// CORS: named policy
/*const string CorsPolicy = "AllowAll";
builder.Services.AddCors(o => o.AddPolicy(CorsPolicy, p =>
    p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()
));*/
const string CorsPolicy = "WebOnly";
builder.Services.AddCors(o => o.AddPolicy(CorsPolicy, p =>
    p.WithOrigins("https://frontend-f4wdwuade-kayabeliz95-8865s-projects.vercel.app")
     .AllowAnyHeader()
     .AllowAnyMethod()
));

//bunlar benim ekledi�im
var cs = builder.Configuration.GetConnectionString("Sqlite") ?? "Data Source=app.db";
builder.Services.AddDbContext<AppDbContext>(o => o.UseSqlite(cs));
//builder.Services.AddScoped<AiClient>(); // Mock AI client�i DI�a ekle
builder.Services.AddHttpClient<AiClient>();
//bunlar zaten vard�
// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// DB'yi olu�tur ve bekleyen migration'lar� uygula
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate(); // app.db olu�turur, Messages tablosunu yarat�r
}

// **CORS'u erkenden uygula**
app.UseCors(CorsPolicy);


// Sa�l�k ucu (Render health check i�in)
app.MapGet("/health", () => "ok");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
