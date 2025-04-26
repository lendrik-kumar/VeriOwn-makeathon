import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaFingerprint, FaArrowRight } from 'react-icons/fa';

const pages = [ "About", "Blog", "Contact"];

function Navbar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) setScrolled(isScrolled);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);

  const handleNavClick = (page) => {
    if (page === "Home") navigate('/home');
    else if (page === "Verify") navigate('/verify');
    else if (page === "Register" || page === "Register-Asset") navigate('/register');
    else navigate(`/${page.toLowerCase()}`);
    handleCloseNavMenu();
  };

  const isActive = (page) => {
    if (page === "Home" && location.pathname === "/") return true;
    return location.pathname === `/${page.toLowerCase()}`;
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: scrolled ? 'rgba(0,0,0,0.95)' : 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(12px)',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.3)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(55,65,81,0.3)' : 'none',
        transition: 'all 0.3s ease',
        zIndex: 1100,
        '& .MuiToolbar-root': { padding: '0.5rem 1rem' }
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo */}
          {/* Removed logo section */}
          {/* Mobile menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="open navigation"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{
                color: '#a5b4fc',
                '&:hover': { background: 'rgba(99,102,241,0.1)' }
              }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'center' }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
                '& .MuiPaper-root': {
                  backgroundColor: 'rgba(0,0,0,0.98)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(99,102,241,0.15)',
                  border: '1px solid rgba(55,65,81,0.3)',
                  mt: 1.5,
                  overflow: 'hidden',
                  left: '50%',
                  transform: 'translateX(-50%)'
                }
              }}
            >
              {pages.map((page, index) => (
                <MenuItem
                  key={page}
                  onClick={() => handleNavClick(page)}
                  sx={{
                    transition: 'all 0.2s ease',
                    borderRadius: '999px',
                    mx: 1,
                    my: 0.5,
                    background: isActive(page)
                      ? 'linear-gradient(90deg, #5eead4 0%, #3b82f6 100%)'
                      : 'transparent',
                    color: isActive(page) ? 'white' : '#e5e7eb',
                    fontWeight: isActive(page) ? 700 : 400,
                    '&:hover': {
                      background: 'linear-gradient(90deg, #22d3ee 0%, #2563eb 100%)',
                      color: 'white',
                    },
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Typography sx={{
                      textAlign: 'center',
                      fontWeight: 'inherit',
                      color: 'inherit',
                    }}>
                      {page}
                    </Typography>
                  </motion.div>
                </MenuItem>
              ))}
              <MenuItem
                onClick={() => { navigate('/login'); handleCloseNavMenu(); }}
                sx={{
                  background: 'linear-gradient(90deg, #5eead4 0%, #3b82f6 100%)', // updated gradient
                  m: 1,
                  borderRadius: '8px',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #22d3ee 0%, #2563eb 100%)',
                    color: 'white'
                  }
                }}
              >
                <Typography sx={{ textAlign: 'center', color: 'white' }}>Login</Typography>
              </MenuItem>
            </Menu>
          </Box>

          {/* Mobile Logo Text */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', flexGrow: 1 }}
          >
            <div className="flex items-center">
              <Typography
                variant="h5"
                noWrap
                component="a"
                href="/home"
                sx={{
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.2rem',
                  background: 'linear-gradient(to right, #22c55e, #3b82f6)', // updated gradient
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textDecoration: 'none',
                }}
              >
                VeriOwn
              </Typography>
            </div>
          </motion.div>

          {/* Desktop menu links */}
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            {pages.map((page) => (
              <motion.div
                key={page}
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.96 }}
              >
                <Button
                  onClick={() => handleNavClick(page)}
                  sx={{
                    my: 2,
                    mx: 1.5,
                    color: isActive(page) ? 'white' : '#f3f4f6',
                    fontWeight: isActive(page) ? 700 : 500,
                    fontSize: '1rem',
                    textTransform: 'none',
                    borderRadius: '999px',
                    px: 2.5,
                    py: 1,
                    background: isActive(page)
                      ? 'linear-gradient(90deg, #5eead4 0%, #3b82f6 100%)'
                      : 'transparent',
                    boxShadow: isActive(page)
                      ? '0 4px 16px -4px rgba(59,130,246,0.25)'
                      : 'none',
                    transition: 'all 0.25s cubic-bezier(.4,0,.2,1)',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #22d3ee 0%, #2563eb 100%)',
                      color: 'white',
                      boxShadow: '0 6px 20px -6px rgba(59,130,246,0.30)',
                    },
                  }}
                >
                  {page}
                </Button>
              </motion.div>
            ))}
            <motion.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.96 }}>
              <Button
                onClick={() => navigate('/login')}
                sx={{
                  my: 1.5,
                  ml: 2,
                  px: 3.5,
                  py: 1,
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '1rem',
                  textTransform: 'none',
                  borderRadius: '999px',
                  background: 'linear-gradient(to right, #22c55e, #3b82f6)', // updated gradient
                  boxShadow: '0 6px 20px -6px rgba(59,130,246,0.30)',
                  border: 'none',
                  transition: 'all 0.25s cubic-bezier(.4,0,.2,1)',
                  '&:hover': {
                    background: 'linear-gradient(to right, #22c55e, #3b82f6)', // reversed for hover
                    boxShadow: '0 10px 28px -8px rgba(59,130,246,0.35)',
                  },
                }}
              >
                Login <FaArrowRight style={{ fontSize: '0.85rem', marginLeft: '4px' }} />
              </Button>
            </motion.div>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
