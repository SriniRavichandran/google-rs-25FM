import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

/**
 * Global reusable Delete Confirmation Dialog.
 * Usage: <DeleteConfirmDialog open={open} onClose={() => setOpen(false)} onConfirm={handleDelete} label="this transaction" />
 */
const DeleteConfirmDialog = ({ open, onClose, onConfirm, label = 'this record' }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          background: 'rgba(20, 10, 10, 0.97)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: 3,
          backdropFilter: 'blur(20px)'
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <WarningAmberIcon sx={{ color: '#ef4444', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#ef4444' }}>
            Confirm Delete
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Are you sure you want to delete <strong style={{ color: 'white' }}>{label}</strong>?
        </Typography>
        <Typography variant="caption" sx={{ color: '#ef4444', mt: 1, display: 'block' }}>
          ⚠️ This will permanently remove the entry from Google Sheets. This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button variant="outlined" color="inherit" onClick={onClose} sx={{ borderRadius: 2 }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => { onConfirm(); onClose(); }}
          sx={{ borderRadius: 2 }}
        >
          Yes, Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
