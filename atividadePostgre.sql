1. Selecionar todos os usuários cujo endereço contenha "São Paulo"
SELECT *
FROM test_client
WHERE test_address ILIKE '%São Paulo%';

2. Atualizar o e-mail de um usuário específico

(Aqui uso id como campo identificador e email como nome de coluna — ajuste conforme sua tabela.)

UPDATE test_client
SET test_mails = 'novoemail@example.com'
WHERE id = 123;

3. Excluir todos os usuários sem endereço definido e com mais de 75 anos

DELETE FROM test_client
WHERE (test_address IS NULL OR test_address = '')
  AND idade > 75;

4. Calcular a média de idade dos usuários que moram em "Belo Horizonte"
SELECT AVG(idade) AS media_idade
FROM test_client
WHERE test_address ILIKE '%Belo Horizonte%';