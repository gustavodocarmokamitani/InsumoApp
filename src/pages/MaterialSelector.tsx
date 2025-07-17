import { useEffect, useState } from "react";
import api from "../services/api";
import type { Insumo } from "../interfaces/Insumo";

import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  Tabs,
  Tab,
  Grid, // Import Grid for layout
} from "@mui/material";

import { useTheme } from "@mui/material/styles";
import { generateQuotePdf } from "../utils/generateQuotePdf";

interface Selecionado extends Insumo {
  quantidade: number;
}

const ITEMS_PER_PAGE = 12;

const MaterialSelector = () => {
  const [busca, setBusca] = useState("");
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [selecionados, setSelecionados] = useState<Selecionado[]>([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [pagina, setPagina] = useState(0);

  // New state variables for client information
  const [clientName, setClientName] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [clientBrandIdentity, setClientBrandIdentity] = useState("");
  const [clientEmail, setClientEmail] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchInsumos = async () => {
      const res = await api.get("/insumos");
      setInsumos(res.data);
    };
    fetchInsumos();
  }, []);

  const insumosFiltrados = insumos.filter((i) =>
    `${i.nome} ${i.categoria} ${i.descricao}`
      .toLowerCase()
      .includes(busca.toLowerCase())
  );

  // Paginação
  const paginaCount = Math.ceil(insumosFiltrados.length / ITEMS_PER_PAGE);
  const insumosPagina = insumosFiltrados.slice(
    pagina * ITEMS_PER_PAGE,
    pagina * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  const adicionar = (insumo: Insumo) => {
    if (selecionados.find((s) => s.id === insumo.id)) return;
    const novo: Selecionado = { ...insumo, quantidade: 1 };
    setSelecionados([...selecionados, novo]);
  };

  const atualizarQuantidade = (id: number, q: number) => {
    if (q < 1) return; // evita quantidade inválida
    setSelecionados((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantidade: q } : item))
    );
  };

  const removerSelecionado = (id: number) => {
    setSelecionados(selecionados.filter((item) => item.id !== id));
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleGeneratePdf = () => {
    generateQuotePdf({
      selecionados: selecionados,
      clientInfo: {
        name: clientName,
        company: clientCompany,
        brandIdentity: clientBrandIdentity,
        email: clientEmail,
      },
    });
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" gutterBottom>
        Selecionar Materiais
      </Typography>

      <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Materiais" />
        <Tab label="Selecionados" />
      </Tabs>

      {tabIndex === 0 && (
        <>
          <TextField
            label="Buscar por nome, categoria ou descrição"
            variant="outlined"
            fullWidth
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value);
              setPagina(0);
            }}
            sx={{ mb: 3 }}
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 1,
              maxHeight: { xs: 450, md: "100%" },
              overflowX: { xs: "hidden", md: "auto" },
              overflowY: { xs: "auto", md: "hidden" },
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              p: 2,
              whiteSpace: "normal",
            }}
          >
            {insumosPagina.length === 0 ? (
              <Typography variant="body1" color="text.secondary">
                Nenhum material encontrado.
              </Typography>
            ) : (
              insumosPagina.map((i) => (
                <Paper
                  key={i.id}
                  elevation={1}
                  sx={{
                    width: {
                      xs: "100%",
                      md: "24.66%",
                    },
                    minHeight: 150,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    p: 1,
                    mb: 1,
                    flexShrink: 0,
                    wordWrap: "break-word",
                    whiteSpace: "normal",
                  }}
                >
                  <Box sx={{ mb: 1 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      noWrap={false}
                    >
                      {i.nome}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ whiteSpace: "normal" }}
                    >
                      {i.categoria} — {i.descricao || "-"}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => adicionar(i)}
                    disabled={selecionados.some((s) => s.id === i.id)}
                  >
                    Selecionar
                  </Button>
                </Paper>
              ))
            )}
          </Box>

          {/* Paginação simples */}
          {paginaCount > 1 && (
            <Box
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "center",
                gap: 1,
              }}
            >
              <Button
                variant="outlined"
                size="small"
                disabled={pagina === 0}
                onClick={() => setPagina(pagina - 1)}
              >
                Anterior
              </Button>
              <Typography
                variant="body2"
                sx={{ alignSelf: "center", userSelect: "none" }}
              >
                Página {pagina + 1} de {paginaCount}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                disabled={pagina >= paginaCount - 1}
                onClick={() => setPagina(pagina + 1)}
              >
                Próxima
              </Button>
            </Box>
          )}
        </>
      )}

      {tabIndex === 1 && (
        <>
          <Typography variant="h5" gutterBottom>
            Selecionados
          </Typography>

          {selecionados.length === 0 ? (
            <Typography variant="body1" color="text.secondary">
              Nenhum material selecionado.
            </Typography>
          ) : (
            <>
              {isMobile ? (
                // VISUALIZAÇÃO MOBILE — formato vertical
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    mb: 3,
                  }}
                >
                  {selecionados.map((s) => (
                    <Paper key={s.id} sx={{ p: 2 }}>
                      <Typography>
                        <strong>Nome:</strong> {s.nome}
                      </Typography>
                      <Typography>
                        <strong>Marca:</strong> {s.marca}
                      </Typography>
                      <Typography>
                        <strong>Unidade:</strong> {s.unidadeMedida}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mt: 1,
                        }}
                      >
                        <Typography>
                          <strong>Quantidade:</strong>
                        </Typography>
                        <TextField
                          type="number"
                          value={s.quantidade}
                          onChange={(e) =>
                            atualizarQuantidade(s.id!, Number(e.target.value))
                          }
                          inputProps={{ min: 1, style: { width: 60 } }}
                          size="small"
                        />
                      </Box>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => removerSelecionado(s.id!)}
                        size="small"
                        sx={{ mt: 2 }}
                      >
                        Remover
                      </Button>
                    </Paper>
                  ))}
                </Box>
              ) : (
                // VISUALIZAÇÃO DESKTOP — tabela padrão
                <TableContainer component={Paper} sx={{ mb: 3 }}>
                  <Table size="medium">
                    <TableHead>
                      <TableRow>
                        <TableCell>Nome</TableCell>
                        <TableCell>Marca</TableCell>
                        <TableCell>Unidade</TableCell>
                        <TableCell>Quantidade</TableCell>
                        <TableCell>Remover</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selecionados.map((s) => (
                        <TableRow key={s.id}>
                          <TableCell>{s.nome}</TableCell>
                          <TableCell>{s.marca}</TableCell>
                          <TableCell>{s.unidadeMedida}</TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              value={s.quantidade}
                              onChange={(e) =>
                                atualizarQuantidade(
                                  s.id!,
                                  Number(e.target.value)
                                )
                              }
                              inputProps={{ min: 1, style: { width: 60 } }}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton
                              color="error"
                              onClick={() => removerSelecionado(s.id!)}
                              size="small"
                            >
                              ❌
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {/* Client Information Inputs */}
              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                Informações do Cliente (Opcional para o PDF)
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  sx={{ width: isMobile ? "100%" : "250px" }}
                  {...({} as any)}
                >
                  <TextField
                    label="Nome do Cliente"
                    fullWidth
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  sx={{ width: isMobile ? "100%" : "250px" }}
                  {...({} as any)}
                >
                  <TextField
                    label="Nome da Empresa"
                    fullWidth
                    value={clientCompany}
                    onChange={(e) => setClientCompany(e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  sx={{ width: isMobile ? "100%" : "250px" }}
                  {...({} as any)}
                >
                  <TextField
                    label="Identidade da Marca"
                    fullWidth
                    value={clientBrandIdentity}
                    onChange={(e) => setClientBrandIdentity(e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  sx={{ width: isMobile ? "100%" : "250px" }}
                  {...({} as any)}
                >
                  <TextField
                    label="Email do Cliente"
                    fullWidth
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    variant="outlined"
                  />
                </Grid>
              </Grid>

              <Button
                variant="contained"
                color="success"
                onClick={handleGeneratePdf}
                fullWidth={isMobile}
                sx={{ maxWidth: isMobile ? "100%" : "200px" }}
              >
                Gerar PDF
              </Button>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default MaterialSelector;
