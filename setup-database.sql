-- Estrutura do banco para o sistema de login
-- Execute este SQL no painel do Supabase em SQL Editor

-- 1. Criar tabela de usuários
CREATE TABLE IF NOT EXISTS public.usuarios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    empresa VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    perfil VARCHAR(50) DEFAULT 'admin' CHECK (perfil IN ('admin', 'user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON public.usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_perfil ON public.usuarios(perfil);

-- 3. Habilitar RLS (Row Level Security)
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- 4. Criar políticas RLS
-- Política para permitir que usuários vejam apenas seus próprios dados
CREATE POLICY "Usuários podem ver seus próprios dados" ON public.usuarios
    FOR SELECT USING (auth.uid()::text = id::text OR auth.jwt()->>'email' = email);

-- Política para permitir inserção de novos usuários (para signup)
CREATE POLICY "Permitir inserção de usuários" ON public.usuarios
    FOR INSERT WITH CHECK (auth.jwt()->>'email' = email);

-- Política para permitir atualização dos próprios dados
CREATE POLICY "Usuários podem atualizar seus próprios dados" ON public.usuarios
    FOR UPDATE USING (auth.uid()::text = id::text OR auth.jwt()->>'email' = email);

-- 5. Criar função trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Criar trigger para atualizar updated_at automaticamente
DROP TRIGGER IF EXISTS trigger_updated_at ON public.usuarios;
CREATE TRIGGER trigger_updated_at
    BEFORE UPDATE ON public.usuarios
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- 7. Comentários para documentação
COMMENT ON TABLE public.usuarios IS 'Tabela de usuários do sistema';
COMMENT ON COLUMN public.usuarios.id IS 'ID único do usuário (UUID)';
COMMENT ON COLUMN public.usuarios.nome IS 'Nome completo do usuário';
COMMENT ON COLUMN public.usuarios.empresa IS 'Nome da empresa do usuário';
COMMENT ON COLUMN public.usuarios.email IS 'Email único do usuário (usado para login)';
COMMENT ON COLUMN public.usuarios.perfil IS 'Perfil de acesso (admin, user)';
COMMENT ON COLUMN public.usuarios.created_at IS 'Data de criação do registro';
COMMENT ON COLUMN public.usuarios.updated_at IS 'Data da última atualização';

-- 8. Inserir usuário de teste (opcional)
-- Descomente as linhas abaixo para criar um usuário de teste
-- INSERT INTO public.usuarios (nome, empresa, email, perfil) 
-- VALUES ('Admin Teste', 'Empresa Teste', 'admin@teste.com', 'admin')
-- ON CONFLICT (email) DO NOTHING;