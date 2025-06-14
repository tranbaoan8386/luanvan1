import FilterListIcon from "@mui/icons-material/FilterList";
import { Button, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useMutation, useQuery } from "@tanstack/react-query";
import * as React from "react";
import { FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import categoryApi from "../../../../apis/category";
import ConfirmDelete from "../../../../components/Admin/ConfirmDelete";
import { toast } from "react-toastify";

const headCells = [
  {
    id: "stt",
    numeric: false,
    disablePadding: true,
    label: "STT"
  },
  {
    id: "name",
    numeric: true,
    disablePadding: false,
    label: "Tên danh mục"
  },
  {
    id: "action",
    numeric: true,
    disablePadding: false,
    label: "Hành động"
  }
];

function EnhancedTableHead() {
  return (
    <TableHead sx={{ backgroundColor: "#F4F6F8" }}>
      <TableRow>
        <TableCell padding="checkbox"></TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="left"
            padding={headCell.disablePadding ? "none" : "normal"}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function EnhancedTableToolbar({ searchQuery, setSearchQuery }) {
  return (
    <Toolbar
      sx={{
        py: 2,
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 }
      }}
    >
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        <TextField
          placeholder="Tìm kiếm danh mục"
          size="medium"
          sx={{ width: "450px" }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Typography>
      <Tooltip title="Filter list">
        <IconButton>
          <FilterListIcon />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
}

export default function ManagerCategory() {
  const refId = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState(""); // Thêm trạng thái tìm kiếm
  const { data: categoriesData, refetch } = useQuery({
    queryKey: ["categories"],
    queryFn: () => {
      return categoryApi.getAllCategory();
    },
    keepPreviousData: true
  });
  const categories = categoriesData?.data || [];

  const handleDelete = (id) => {
    setOpen(true);
    refId.current = id;
  };

  const deleteMutation = useMutation({
    mutationFn: (id) => categoryApi.delete(id),
    onSuccess: () => {
      refetch();
    }, onError: () => {
      toast.error('Không thể xóa vì danh mục có sản phẩm')
    }
  });

  const handleConfirm = () => {
    const idDelete = refId.current;
    deleteMutation.mutate(idDelete);
    refId.current = null;
    setOpen(false);
  };

  // Lọc danh sách loại sản phẩm dựa trên từ khóa tìm kiếm
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <React.Fragment>
      <ConfirmDelete onConfirm={handleConfirm} open={open} setOpen={setOpen} />
      <Box sx={{ width: "100%" }}>
        <Box
          sx={{
            width: "100%",
            mb: 2,
            px: 4,
            py: 2,
            backgroundColor: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <Typography fontSize="24px" component="p">
            Quản lý danh mục
          </Typography>
          <Link to="/admin/category/create">
            <Button sx={{ height: "55px" }} variant="outlined" color="success">
              <FaPlus
                style={{ marginBottom: "4px", marginRight: "5px" }}
                fontSize="18px"
              />
              Thêm danh mục
            </Button>
          </Link>
        </Box>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <EnhancedTableToolbar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
              <EnhancedTableHead />
              <TableBody>
                {filteredCategories.map((category, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={category.id}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell padding="checkbox"></TableCell>
                      <TableCell
                        sx={{ width: "30%" }}
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {index + 1}
                      </TableCell>
                      <TableCell align="left">{category.name}</TableCell>
                      <TableCell align="left">
                        <Button
                          onClick={() => handleDelete(category.id)}
                          variant="outlined"
                          color="error"
                        >
                          Xóa
                        </Button>
                        <Link to={`/admin/category/update/${category.id}`}>
                          <Button
                            sx={{ ml: 1 }}
                            variant="outlined"
                            color="primary"
                          >
                            Sửa
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </React.Fragment>
  );
}
