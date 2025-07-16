import { useState, useEffect } from "react";
import api from "../services/api";
import type { Insumo } from "../interfaces/Insumo";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";

import Grid from "@mui/material/Grid";
import { useSnackbar } from "notistack";
import theme from "../theme/theme";

const Home = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [filteredInsumos, setFilteredInsumos] = useState<Insumo[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [form, setForm] = useState<Insumo>({
    nome: "",
    categoria: "",
    descricao: "",
    unidadeMedida: "",
    marca: "",
  });

  const { enqueueSnackbar } = useSnackbar();

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const sortedInsumos = [...filteredInsumos].sort((a, b) => a.id! - b.id!);
  const currentItems = sortedInsumos.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredInsumos.length / itemsPerPage);

  const fetchInsumos = async () => {
    try {
      const res = await api.get("/insumos");
      setInsumos(res.data);
      setFilteredInsumos(res.data);
    } catch (err) {
      console.error("Erro ao buscar insumos", err);
    }
  };

  useEffect(() => {
    fetchInsumos();
  }, []);

  // Atualiza o filtro sempre que searchTerm ou insumos mudam
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFilteredInsumos(
      insumos.filter(
        (insumo) =>
          insumo.nome.toLowerCase().includes(term) ||
          insumo.categoria.toLowerCase().includes(term) ||
          (insumo.descricao && insumo.descricao.toLowerCase().includes(term))
      )
    );
  }, [searchTerm, insumos]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId !== null) {
        // Atualização
        await api.put(`/insumos/${editingId}`, [form]);
      } else {
        // Criação
        await api.post("/insumos", [form]);
      }

      setForm({
        nome: "",
        categoria: "",
        descricao: "",
        unidadeMedida: "",
        marca: "",
      });
      setEditingId(null);
      fetchInsumos();
    } catch (err) {
      console.error("Erro ao salvar insumo", err);
    }
  };

  const handleEdit = (insumo: Insumo) => {
    setForm(insumo);
    setEditingId(insumo.id!);
  };

  const handleCancelEdit = () => {
    setForm({
      nome: "",
      categoria: "",
      descricao: "",
      unidadeMedida: "",
      marca: "",
    });
    setEditingId(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/insumos/${id}`);
      setInsumos((prev) => prev.filter((insumo) => insumo.id !== id));
      enqueueSnackbar("Insumo removido com sucesso!", { variant: "success" });
    } catch (err) {
      console.error("Erro ao remover insumo", err);
      enqueueSnackbar("Erro ao remover insumo.", { variant: "error" });
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" gutterBottom>
        Cadastro de Insumos
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid
            {...({} as any)}
            item
            xs={12}
            sm={6}
            md={4}
            sx={{ width: isMobile ? "100%" : "250px" }}
          >
            <TextField
              label="Nome"
              name="nome"
              fullWidth
              value={form.nome}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid
            {...({} as any)}
            item
            xs={12}
            sm={6}
            md={4}
            sx={{ width: isMobile ? "100%" : "250px" }}
          >
            <TextField
              label="Categoria"
              name="categoria"
              fullWidth
              value={form.categoria}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid
            {...({} as any)}
            item
            xs={12}
            md={4}
            sx={{ width: isMobile ? "100%" : "250px" }}
          >
            <TextField
              label="Descrição"
              name="descricao"
              fullWidth
              value={form.descricao}
              onChange={handleChange}
            />
          </Grid>

          <Grid
            {...({} as any)}
            item
            xs={12}
            sm={6}
            md={4}
            sx={{ width: isMobile ? "100%" : "250px" }}
          >
            <TextField
              label="Unidade de Medida"
              name="unidadeMedida"
              fullWidth
              value={form.unidadeMedida}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid
            {...({} as any)}
            item
            xs={12}
            sm={6}
            md={4}
            sx={{ width: isMobile ? "100%" : "250px" }}
          >
            <TextField
              label="Marca"
              name="marca"
              type="string"
              fullWidth
              value={form.marca}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid
            container
            spacing={2}
            sx={{ width: isMobile ? "100%" : "250px" }}
          >
            <Grid
              {...({} as any)}
              item
              xs={12}
              sm={editingId !== null ? 6 : 12}
              sx={{ width: isMobile ? "100%" : "250px" }}
            >
              <Button
                type="submit"
                variant="contained"
                color={editingId !== null ? "warning" : "primary"}
                fullWidth
                sx={{ height: "56px", width: isMobile ? "100%" : "250px" }}
              >
                {editingId !== null ? "Atualizar" : "Adicionar"}
              </Button>
            </Grid>

            {editingId !== null && (
              <Grid {...({} as any)} item xs={12} sm={6}>
                <Button
                  variant="outlined"
                  color="inherit"
                  fullWidth
                  onClick={handleCancelEdit}
                  sx={{ height: "56px" }}
                >
                  Cancelar
                </Button>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Box>

      {/* Campo de busca */}
      <TextField
        label="Pesquisar por Nome, Categoria ou Descrição"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{ mb: 3 }}
      />

      <Typography variant="h5" gutterBottom>
        Lista de Insumos
      </Typography>

      <Grid container spacing={2}>
        {currentItems.map((insumo) => (
          <Grid
            {...({} as any)}
            item
            xs={12}
            sm={6}
            md={4}
            key={insumo.id}
            sx={{ maxWidth: "350px", minHeight: "350px" }}
          >
            <Card
              sx={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CardContent>
                <Typography variant="h6">{insumo.nome}</Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ my: 2 }}
                >
                  Categoria: {insumo.categoria}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ my: 2 }}
                >
                  Descrição: {insumo.descricao}, {insumo.descricao},{" "}
                  {insumo.descricao}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ my: 2 }}
                >
                  Unidade: {insumo.unidadeMedida}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  Marca: {insumo.marca}
                </Typography>

                <Button
                  onClick={() => handleEdit(insumo)}
                  variant="outlined"
                  color="warning"
                  sx={{ mt: 2, mr: 1 }}
                >
                  Editar
                </Button>

                <Button
                  onClick={() => handleDelete(insumo.id!)}
                  variant="outlined"
                  color="error"
                  sx={{ mt: 2 }}
                >
                  Remover
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Button
          variant="outlined"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          sx={{ mr: 2 }}
        >
          Anterior
        </Button>
        <Typography variant="body1" sx={{ mx: 2 }}>
          Página {currentPage} de {totalPages}
        </Typography>
        <Button
          variant="outlined"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Próxima
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
