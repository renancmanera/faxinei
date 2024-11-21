using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class UsuariosController : ControllerBase
{
    // POST api/usuarios
    [HttpPost]
    public IActionResult CriarUsuario([FromBody] Usuario usuario)
    {
        if (usuario == null || string.IsNullOrEmpty(usuario.Email) || string.IsNullOrEmpty(usuario.Senha))
            return BadRequest("Dados do usuário inválidos");

        // Simulação: lógica de armazenamento de dados no banco de dados ou Firebase
        // Você pode substituir esta parte pela integração com um serviço de banco de dados ou Firebase

        return Ok(new { message = "Usuário criado com sucesso!" });
    }
}

public class Usuario
{
    public string Nome { get; set; } = string.Empty;       // Valor padrão
    public string Sobrenome { get; set; } = string.Empty;  // Valor padrão
    public string Email { get; set; } = string.Empty;      // Valor padrão
    public string Senha { get; set; } = string.Empty;      // Valor padrão
    public string Objetivo { get; set; } = string.Empty;   // Valor padrão
}

