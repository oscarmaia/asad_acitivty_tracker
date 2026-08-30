Atue como um Engenheiro de Software Full-Stack Sênior especialista em React, Next.js (App Router), TypeScript, Tailwind CSS e Supabase.

O objetivo é criar um sistema web de gestão interna para uma associação de apoio social (ASAD), focado na usabilidade para utilizadores não-técnicos. A aplicação vai substituir um sistema em AppSheet, e a sua principal missão é o registo de atividades e a geração de um relatório PDF estruturado.

### 1. Stack Tecnológico
- **Frontend/Framework:** Next.js (App Router) com React e TypeScript.
- **Estilização:** Tailwind CSS (e shadcn/ui para componentes base rápidos e acessíveis).
- **Backend/Base de Dados:** Supabase (PostgreSQL, Auth e API REST automática).
- **Geração de PDF:** `@react-pdf/renderer` (ou biblioteca similar robusta para desenhar layouts complexos e tabelas).

### 2. Esquema de Base de Dados (Relacional)
Por favor, gere as *migrations* ou as *queries* SQL para criar as seguintes tabelas no Supabase (incluindo RLS policies básicas):

- **`utentes`**:
  - `id` (UUID, PK)
  - `nome` (Text)
  - `apelido` (Text)
  - `ativo` (Boolean, default true)

- **`atividades`**:
  - `id` (UUID, PK)
  - `data` (Date)
  - `local` (Text)
  - `duracao` (Text)
  - `oficina` (Text)
  - `atividade_nome` (Text)
  - `recursos_humanos` (Text)
  - `objetivos` (Text)
  - `avaliacao_global` (Text)
  - `dificuldades` (Text)
  - `outras_informacoes` (Text)

- **`avaliacoes` (Tabela de Junção / Relacionamento 1:N com Utentes e Atividades)**:
  - `id` (UUID, PK)
  - `atividade_id` (UUID, FK -> atividades.id)
  - `utente_id` (UUID, FK -> utentes.id)
  - `grau_participacao` (Text - Valores permitidos: 'MB', 'B', 'S', 'PS', 'I')
  - `interesse_demonstrado` (Text - Valores permitidos: 'MB', 'B', 'S', 'PS', 'I')
  - `alcance_objetivos` (Text - Valores permitidos: 'MB', 'B', 'S', 'PS', 'I')

### 3. Funcionalidades Principais a Desenvolver
1. **Autenticação:** Login simples protegido pelo Supabase Auth.
2. **Dashboard de Atividades:** Uma listagem das atividades recentes com opção de pesquisa por data ou oficina.
3. **Formulário de Criação/Edição de Atividade:**
   - Formulário limpo e validado (com Zod/React Hook Form) para os dados principais da atividade.
   - Uma secção dinâmica (estilo *Repeater* ou Tabela Interativa) para adicionar Utentes àquela atividade e classificar a sua `nota` no mesmo ecrã.
4. **Funcionalidade de "Duplicar":** Um botão que permite criar uma nova atividade copiando os textos (oficina, objetivos, recursos) de uma atividade anterior, mas deixando a lista de avaliações de utentes vazia para o novo dia.
5. **Geração do PDF (Registo de Atividade):** Um botão na vista de detalhe da atividade que descarrega um PDF com o seguinte layout rígido:
   - **Cabeçalho:** Informações da ASAD.
   - **Corpo 1:** Campos de texto da Atividade (Data, Local, Duração, etc.).
   - **Tabela de Utentes:** Uma grelha iterando sobre as avaliações da atividade. Colunas: Nome do Utente, Presença (F ou X), e a Nota desdobrada pelas colunas de avaliação.
   - **Rodapé:** Morada, NIPC e contactos da associação.

### 4. Instruções de Implementação
- Crie o fluxo de inicialização do projeto e as variáveis de ambiente necessárias.
- Forneça o código para o esquema SQL no Supabase.
- Construa a chamada de cliente necessária para fazer o *insert* transacional de uma nova Atividade em conjunto com a sua *array* de Avaliações.
- Garanta que o código é limpo, modular e focado em resolver a arquitetura de dados antes de embelezar a interface.