import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { escolaService, EscolaConfiguracao } from '@/lib/services/escolaService';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';

export default function EscolaPerfil() {
  const [configuracao, setConfiguracao] = useState<EscolaConfiguracao | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadConfiguracao();
  }, []);

  const loadConfiguracao = async () => {
    try {
      const data = await escolaService.getConfiguracao();
      setConfiguracao(data);
    } catch (error) {
      console.error('Erro ao carregar configuração:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!configuracao) return;

    setSaving(true);
    try {
      await escolaService.updateConfiguracao(configuracao);
      toast({
        title: 'Sucesso',
        description: 'Configurações atualizadas com sucesso!',
      });
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !configuracao) return;

    setUploadingLogo(true);
    try {
      const logoUrl = await escolaService.uploadLogo(file);
      setConfiguracao(prev => prev ? { ...prev, url_logo: logoUrl } : null);
      toast({
        title: 'Sucesso',
        description: 'Logo atualizado com sucesso!',
      });
    } catch (error) {
      console.error('Erro ao fazer upload do logo:', error);
    } finally {
      setUploadingLogo(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!configuracao) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Nenhuma configuração encontrada.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Perfil da Escola</CardTitle>
          <CardDescription>
            Configure as informações básicas da sua escola
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {configuracao.url_logo && (
                  <img
                    src={configuracao.url_logo}
                    alt="Logo da escola"
                    className="w-20 h-20 object-contain rounded-lg border"
                  />
                )}
                <div className="flex-1">
                  <Label htmlFor="logo">Logo da Escola</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={uploadingLogo}
                    />
                    {uploadingLogo && <Loader2 className="h-4 w-4 animate-spin" />}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome da Escola</Label>
                  <Input
                    id="nome"
                    value={configuracao.nome}
                    onChange={(e) => setConfiguracao(prev => prev ? { ...prev, nome: e.target.value } : null)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={configuracao.email}
                    onChange={(e) => setConfiguracao(prev => prev ? { ...prev, email: e.target.value } : null)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={configuracao.telefone || ''}
                    onChange={(e) => setConfiguracao(prev => prev ? { ...prev, telefone: e.target.value } : null)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cor_primaria">Cor Primária</Label>
                  <div className="flex gap-2">
                    <Input
                      id="cor_primaria"
                      type="color"
                      value={configuracao.cor_primaria}
                      onChange={(e) => setConfiguracao(prev => prev ? { ...prev, cor_primaria: e.target.value } : null)}
                      className="w-20 h-10 p-1"
                    />
                    <Input
                      type="text"
                      value={configuracao.cor_primaria}
                      onChange={(e) => setConfiguracao(prev => prev ? { ...prev, cor_primaria: e.target.value } : null)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cor_secundaria">Cor Secundária</Label>
                  <div className="flex gap-2">
                    <Input
                      id="cor_secundaria"
                      type="color"
                      value={configuracao.cor_secundaria}
                      onChange={(e) => setConfiguracao(prev => prev ? { ...prev, cor_secundaria: e.target.value } : null)}
                      className="w-20 h-10 p-1"
                    />
                    <Input
                      type="text"
                      value={configuracao.cor_secundaria}
                      onChange={(e) => setConfiguracao(prev => prev ? { ...prev, cor_secundaria: e.target.value } : null)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Textarea
                  id="endereco"
                  value={configuracao.endereco || ''}
                  onChange={(e) => setConfiguracao(prev => prev ? { ...prev, endereco: e.target.value } : null)}
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Alterações'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 