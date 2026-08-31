-- Habilitar a extensão pgcrypto para UUIDs
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Criação da Tabela de Utentes
CREATE TABLE IF NOT EXISTS utentes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  alcunha TEXT NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Criação da Tabela de Atividades
CREATE TABLE IF NOT EXISTS atividades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data DATE NOT NULL,
  local TEXT NOT NULL,
  duracao TEXT NOT NULL,
  oficina TEXT NOT NULL,
  atividade_nome TEXT NOT NULL,
  recursos_humanos TEXT NOT NULL,
  objetivos TEXT NOT NULL,
  avaliacao_global TEXT,
  dificuldades TEXT,
  outras_informacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Criação da Tabela de Avaliações (Junção Utente-Atividade)
CREATE TABLE IF NOT EXISTS avaliacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  atividade_id UUID NOT NULL REFERENCES atividades(id) ON DELETE CASCADE,
  utente_id UUID NOT NULL REFERENCES utentes(id) ON DELETE CASCADE,
  grau_participacao TEXT CHECK (grau_participacao IN ('MB', 'B', 'S', 'PS', 'I')),
  interesse_demonstrado TEXT CHECK (interesse_demonstrado IN ('MB', 'B', 'S', 'PS', 'I')),
  alcance_objetivos TEXT CHECK (alcance_objetivos IN ('MB', 'B', 'S', 'PS', 'I')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(atividade_id, utente_id) -- Garantir que um utente não é avaliado duas vezes na mesma atividade
);

-- Ativar RLS (Row Level Security)
ALTER TABLE utentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE atividades ENABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacoes ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS simples (Permitir tudo a utilizadores autenticados)
-- Em produção, pode refinar para ver apenas dados da sua organização/perfil.
CREATE POLICY "Autenticados podem ler utentes" ON utentes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Autenticados podem inserir utentes" ON utentes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Autenticados podem atualizar utentes" ON utentes FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Autenticados podem apagar utentes" ON utentes FOR DELETE TO authenticated USING (true);

CREATE POLICY "Autenticados podem ler atividades" ON atividades FOR SELECT TO authenticated USING (true);
CREATE POLICY "Autenticados podem inserir atividades" ON atividades FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Autenticados podem atualizar atividades" ON atividades FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Autenticados podem apagar atividades" ON atividades FOR DELETE TO authenticated USING (true);

CREATE POLICY "Autenticados podem ler avaliacoes" ON avaliacoes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Autenticados podem inserir avaliacoes" ON avaliacoes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Autenticados podem atualizar avaliacoes" ON avaliacoes FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Autenticados podem apagar avaliacoes" ON avaliacoes FOR DELETE TO authenticated USING (true);

-- Dados dummy para Utentes (opcional, para testar)
INSERT INTO utentes (nome, alcunha) VALUES
  ('Mônica', 'Moki'),
  ('Suzana', 'Suzaninha'),
  ('Conceição', 'Sãozinha');