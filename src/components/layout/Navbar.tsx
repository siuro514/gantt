import { AppBar, Toolbar, Typography, Container, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <AppBar position="sticky" elevation={0} sx={{ 
      backgroundColor: 'background.paper',
      borderBottom: '1px solid',
      borderColor: 'divider',
    }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: '64px' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 700, 
                color: 'primary.main',
                fontSize: '1.5rem',
              }}>
                ⚡ Eazy & Good Things
              </Typography>
            </Box>
          </Link>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button component={Link} to="/blog" sx={{ color: 'text.primary' }}>
              文章
            </Button>
            <Button component={Link} to="/about" sx={{ color: 'text.primary' }}>
              關於
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

