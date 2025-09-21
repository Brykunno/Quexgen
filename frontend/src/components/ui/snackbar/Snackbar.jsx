import React from "react";
import { useSnackbar } from "notistack";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function useAppSnackbar() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const showSnackbar = (message, status) => {
    enqueueSnackbar(message, {
      action: (key) => (
        <IconButton onClick={() => closeSnackbar(key)} color="inherit">
          <CloseIcon />
        </IconButton>
      ),
      variant: status?.variant || "default", // success, error, warning, info
    });
  };

  return { showSnackbar };
}

export default useAppSnackbar
