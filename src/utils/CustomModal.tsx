import React from 'react';
import { Button, Grid, Modal, Paper, Stack, Typography } from "@mui/material";

interface ModalProps {
    onOpen: boolean
    onClose: () => void
    onYes: () => void; 
    onNo: () => void; 
    title: string
}

const ModalCustom: React.FC<ModalProps> = ({ onOpen, onYes, onNo, title, onClose }) => {
    return (
        <Modal
            open={onOpen}
            onClose={onClose}  // Usando a função onClose
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
        >
            <Paper
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 'auto', 
                    height: 'auto', 
                    textAlign: 'center',
                }}
                
            >
                <Grid container marginTop={10} marginBottom={10} justifyContent='center'>
                    <Grid item xs={12}>
                        <Typography variant='h5'>{title}</Typography>
                    </Grid>
                    <Grid item marginTop={3}>
                        <Stack direction='row' spacing={5}>
                            <Button variant='outlined' onClick={onNo}>
                                Não
                            </Button>
                            <Button variant='contained' onClick={onYes}>
                                Sim
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Paper>
        </Modal>
    );
};

export default ModalCustom;
