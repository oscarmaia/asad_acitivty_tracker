import { supabase } from '../lib/supabase/client';

export type UtenteData = {
  id?: string;
  nome: string;
  alcunha: string;
  ativo: boolean;
};

export const utentesService = {
  async getUtentes() {
    const { data, error } = await supabase
      .from('utentes')
      .select('*')
      .order('nome', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async saveUtente(utente: UtenteData) {
    if (utente.id) {
      const { data, error } = await supabase
        .from('utentes')
        .update({ nome: utente.nome, alcunha: utente.alcunha, ativo: utente.ativo })
        .eq('id', utente.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('utentes')
        .insert([{ nome: utente.nome, alcunha: utente.alcunha, ativo: utente.ativo ?? true }])
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  }
};
