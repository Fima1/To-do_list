import React, { useEffect } from 'react';
import { useState} from 'react';
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { makeStyles } from '@material-ui/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid';

// figure out moving down cards when expanding
// delete old code

const useStyles = makeStyles({
    action: {
        flex: '0 1 auto',
        flexBasis: 'start'
    },
    title: {
        fontSize: '21px'
    }
  })


  const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  }));
  

const TaskCard = ({id, name, description, getLatestTasks}) => {

    const classes = useStyles();

    const [taskEdit, setTaskEdit] = useState({name: name, description: description});
    const [isEditing, setIsEditing] = useState(false);
    const [expanded, setExpanded] = useState(false);
   
    useEffect(() => {
        setTaskEdit({name: name, description: description})
        setIsEditing(false)
    }, [id])

    const processDelete = () => {
        fetch("http://localhost:5000/delete_task", {
        method: 'POST',
        body: JSON.stringify({
            id: id
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    }).then(response => response.json())
    .then(message => {console.log(message)
    getLatestTasks() 
        })
    }

    const handleEditChange = (input) => {
        setTaskEdit(input)
    }

    const processEditSubmit = () => {

        fetch("http://localhost:5000/edit_task", {
            method: 'POST',
            body: JSON.stringify({
                name: taskEdit.name,
                description: taskEdit.description,
                id: id
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then(response => response.json())
            .then(message => {
                console.log(message);
                setIsEditing(false);
                getLatestTasks();
            });
    }

    const startEdit = () => {
        setIsEditing(true)
    }


    const handleExpandClick = () => {
        setExpanded(!expanded);
      };
    
    return(
    <Grid item xs="auto">
    <li key={id.toString()} className='taskLi'>
        <Card>
                <Checkbox 
                    sx={{position: "fixed", mt: 1.5}}
                    onClick={processDelete}
                    icon={<CheckCircleOutlineIcon sx={{color: "#757575"}} />}
                    checkedIcon={<CheckCircleIcon/>}/>
                <CardHeader
                    sx={{ml: 3}}
                    action={
                    <>
                        <TaskDialog 
                            editInput={taskEdit}
                            onEditChange={handleEditChange}
                            onEditSubmit={processEditSubmit} />
                                                
                        <ExpandMore
                            expand={expanded}
                            onClick={handleExpandClick}
                            aria-expanded={expanded}
                            aria-label="show more"
                            >
                            <ExpandMoreIcon />
                        </ExpandMore>
                    </>
                    }
                    classes={{ action: classes.action, title: classes.title }}
                    title={taskEdit.name}
                    >
                    
                </CardHeader>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                    <Typography variant="h6">Description: </Typography>
                    <Typography paragraph>{taskEdit.description}</Typography>
                    </CardContent>
                </Collapse>
        </Card>
    </li>
    </Grid>
    )
}

const TaskDialog = ({editInput, onEditChange, onEditSubmit}) => {
    const [open, setOpen] = useState(false);
    const [tempVals, setTempVals] = useState({name: "", description: ""});
    
    const handleClickOpen = () => {
        setTempVals(
            {name: editInput.name, description: editInput.description}
        )
        setOpen(true);
    }

    const handleClose = () => {
        setTempVals({name: "", description: ""})
        setOpen(false);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        onEditChange({
        ...editInput,
        [name]: value,
        });
    }

    const handleSubmit = (e) =>{
        e.preventDefault()
        onEditSubmit()
        handleClose()
      }

      const handleCancel = () => {
        handleClose()
        onEditChange({
            name: tempVals.name,
            description: tempVals.description
        })
    }

    return(
    <>
        <IconButton sx={{ml:1}} onClick={handleClickOpen}>
            <EditIcon/>
        </IconButton>

        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{editInput.name}</DialogTitle>
           
            <DialogContentText sx={{ml: 3}}>
                Edit task:
            </DialogContentText>
           
            <form onSubmit={handleSubmit}>
            <DialogContent>
            <TextField
                required
                name='name'
                autoComplete='off'
                label="Task name"
                value={editInput.name}
                onChange={handleChange}
                autoFocus 
                placeholder='Enter task name'
                sx={{mb: 2}}/>
            <br/>
            <TextField
                name='description'
                autoComplete='off'
                label='Description'
                value={editInput.description}
                onChange={handleChange}
                multiline
                placeholder='Add description' />
            </DialogContent>
           
            <DialogActions>
                <Button onClick={handleCancel}>
                    Cancel
                </Button>
                <Button type='submit'>
                    Submit
                </Button> 
            </DialogActions>
            </form>
        </Dialog>

    </>
    )

}
export default TaskCard;