var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();  // Adiciona suporte para controllers

// Configuração do Swagger para documentação da API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

// Mapeamento de rotas para controllers
app.MapControllers(); // Habilita o roteamento baseado em controllers

app.Run();
