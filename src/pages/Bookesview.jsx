import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchBooks } from "../store/booksSlice";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  TextField,
  Container,
  CardActionArea,
} from "@mui/material";

export default function BookGrid() {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { books: Books } = useSelector((state) => state.books);

  const makeSlug = (title) =>
    title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

  const handleView = (book) => {
    const slug = makeSlug(book.title);
    navigate(`/book/${slug}/bookdetails`, { state: { id: book._id } });
  };

  useEffect(() => {
    dispatch(searchBooks());
  }, [dispatch]);

  // Filtered search
  const filteredBooks = Books.filter((book) => {
    const titleMatch = book.title.toLowerCase().includes(search.toLowerCase());
    const authorMatch = book.author?.toLowerCase().includes(search.toLowerCase());
    const keywordsMatch = book.keywords?.some((kw) =>
      kw.toLowerCase().includes(search.toLowerCase())
    );

    return titleMatch || authorMatch || keywordsMatch;
  });

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50", py: 6 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          fontWeight="bold"
          color="text.primary"
          gutterBottom
        >
          Book Collection
        </Typography>

        {/* Search bar */}
        <Box display="flex" justifyContent="center" mb={4}>
          <TextField
            label="Search by title, author, or keyword..."
            variant="outlined"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              maxWidth: 500,
              bgcolor: "white",
              borderRadius: 2,
            }}
          />
        </Box>

        {/* Grid of books */}
        <Grid container spacing={4}>
          {filteredBooks.map((book) => (
            <Grid
              key={book._id}
              xs={{ span: 12 }}
              sm={{ span: 6 }}
              md={{ span: 4 }}
              lg={{ span: 3 }}
            >
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: "0.3s",
                  "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
                }}
              >
                <CardActionArea onClick={() => handleView(book)}>
                  <CardMedia
                    component="img"
                    height="280"
                    image={`http://localhost:7000/${book.coverImage}`}
                    alt={book.title}
                    sx={{
                      borderTopLeftRadius: 12,
                      borderTopRightRadius: 12,
                      objectFit: "cover",
                    }}
                  />
                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="text.primary"
                      noWrap
                    >
                      {book.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                      noWrap
                    >
                      {book.author}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
