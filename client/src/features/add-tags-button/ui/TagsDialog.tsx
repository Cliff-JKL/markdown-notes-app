import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  PaperProps,
  Slide,
  Stack,
  TextField,
} from '@mui/material';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { observer } from 'mobx-react-lite';
import { useStores } from 'app/root-store-context';
import { UpdateTag, type Tag } from 'shared/api';
import { generateItemKey } from 'shared/lib';
import Draggable from 'react-draggable';

const PaperComponent = (props: PaperProps) => {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper
        sx={{ height: '477px', width: '294px', overflow: 'hidden' }}
        {...props}
      />
    </Draggable>
  );
};

interface TagListItemProps {
  tag: Tag;
}

interface EditModeTagListItemProps extends TagListItemProps {
  onEdit: (tagId: string) => void;
  onDelete: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    tagId: string,
  ) => void;
}

const EditModeTagListItem = (props: EditModeTagListItemProps) => {
  const { tag, onEdit, onDelete } = props;

  const labelId = `checkbox-list-label-${tag.name}`;

  return (
    <ListItem
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="edit"
          onClick={(event) => onEdit(tag.id)}
        >
          <EditIcon />
        </IconButton>
      }
      disablePadding
    >
      <ListItemAvatar>
        <IconButton onClick={(event) => onDelete(event, tag.id)}>
          <RemoveCircleIcon color="error" />
        </IconButton>
      </ListItemAvatar>
      <ListItemText id={labelId} primary={tag.name} />
    </ListItem>
  );
};

interface ReadTagListItemProps extends TagListItemProps {
  onToggle: (tag: Tag) => () => void;
  checked: boolean;
}

const ReadModeTagListItem = (props: ReadTagListItemProps) => {
  const { tag, onToggle, checked } = props;

  const labelId = `checkbox-list-label-${tag.name}`;

  return (
    <ListItem
      secondaryAction={
        <Checkbox
          edge="end"
          // onChange={onToggle(tag)}
          // onClick={() => onToggle(tag)}
          onChange={onToggle(tag)}
          checked={checked}
          inputProps={{ 'aria-labelledby': labelId }}
        />
      }
      disablePadding
    >
      <ListItemButton>
        <ListItemIcon>
          {checked ? <LocalOfferIcon /> : <LocalOfferOutlinedIcon />}
        </ListItemIcon>
        <ListItemText id={labelId} primary={tag.name} />
      </ListItemButton>
    </ListItem>
  );
};

interface CreateTagFormProps {
  onCreate: (name: string) => void;
}

const CreateTagForm = (props: CreateTagFormProps) => {
  const { onCreate } = props;

  const [name, setName] = useState('');

  const handleCreate = () => {
    onCreate(name);
    setName('');
  };

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <LocalOfferOutlinedIcon />
      <TextField
        label="new tag"
        variant="outlined"
        size="small"
        value={name}
        onChange={(event) => setName(event.target.value)}
        margin="none"
      />
      <IconButton aria-label="newItem" onClick={handleCreate}>
        <DoneIcon />
      </IconButton>
    </Stack>
  );
};

interface EditTagFormProps {
  onEdit: (id: string, name: string) => void;
  tag: Tag;
}

const EditTagForm = (props: EditTagFormProps) => {
  const { onEdit, tag } = props;

  const [name, setName] = useState(tag.name);

  const handleEdit = () => {
    onEdit(tag.id, name);
  };

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <LocalOfferOutlinedIcon />
      <TextField
        label="new tag"
        variant="outlined"
        size="small"
        value={name}
        onChange={(event) => setName(event.target.value)}
        margin="none"
      />
      <IconButton aria-label="editItem" onClick={handleEdit}>
        <DoneIcon />
      </IconButton>
    </Stack>
  );
};

interface TagsDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (checked: Tag[]) => void;
  items: Tag[];
}

export const TagsDialog = observer((props: TagsDialogProps) => {
  const { open, onClose, items, onSubmit } = props;

  const { tags } = useStores();

  const [checked, setChecked] = useState(items);
  const [manageMode, setManageMode] = useState(false);
  const [editItem, setEditItem] = useState<string>(null);

  const containerRef = useRef<HTMLElement>(null);

  const handleManage = () => {
    setManageMode((prev) => !prev);
  };

  useEffect(() => {
    console.log(`TagsDialog open: ${open}`);
    if (open) setChecked(items);
    tags.getTagsAction();
    return () => setManageMode(false);
  }, [open]);

  const createTag = (name: string) => {
    tags.createTagAction(name);
  };

  const editTag = (id: string, name: string) => {
    const updateFields: UpdateTag = {
      fields: {
        name: name,
      },
    };
    tags.updateTagAction(id, updateFields);
    setEditItem(null);
  };

  const deleteTag = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    tagId: string,
  ) => {
    tags.deleteTagAction(tagId);
  };

  const handleToggle = (value: Tag) => () => {
    const currentIndex = checked.map((c) => c.id).indexOf(value.id);
    console.log({ currentIndex });
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const compareTags = (a: Tag, b: Tag) => {
    const ids = checked.map((c) => c.id),
      aId = a.id,
      bId = b.id,
      aName = a.name.toLowerCase(),
      bName = b.name.toLowerCase();

    if (ids.includes(aId) && ids.includes(bId)) {
      if (aName < bName) return -1;
      else return 1;
    } else if (!ids.includes(aId) && !ids.includes(bId)) {
      if (aName < bName) return -1;
      else return 1;
    } else if (ids.includes(aId)) {
      return -1;
    } else {
      return 1;
    }
  };

  const compareTagsByName = (a: Tag, b: Tag) => {
    const aName = a.name.toLowerCase(), bName = b.name.toLowerCase();
    if (aName < bName) return -1;
    else return 1;
  };

  enum SortType {
    Full,
    ByName,
  }

  const sortedTags = (items: Tag[], sortBy: SortType = SortType.Full) => {
    if (sortBy === SortType.Full) {
      return items.slice().sort(compareTags);
    } else {
      return items.slice().sort(compareTagsByName);
    }
  };

  const isTagChecked = (tagId: string) => {
    return checked.map((c) => c.id).includes(tagId);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="paper"
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
    >
      <Box ref={containerRef}>
        <Box sx={{ position: 'absolute', zIndex: 1, width: '100%' }}>
          <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
            Tags
          </DialogTitle>
          <DialogContent>
            <DialogContentText>Choose tags</DialogContentText>
            <List
              dense
              sx={{
                width: '100%',
                maxHeight: '300px',
                overflow: 'auto',
                scrollbarWidth: 'none',
                scrollbarColor: 'transparent transparent',
              }}
            >
              {sortedTags(tags.tags).map((tag) => (
                <ReadModeTagListItem
                  key={generateItemKey(tag.name, tag.id)}
                  tag={tag}
                  onToggle={handleToggle}
                  checked={isTagChecked(tag.id)}
                />
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleManage()}>Manage</Button>
            <Button onClick={() => onSubmit(checked)}>Select</Button>
          </DialogActions>
        </Box>
        <Slide
          style={{ position: 'absolute', zIndex: 2, width: '100%' }}
          in={manageMode}
          container={containerRef.current}
          direction="left"
        >
          <Paper elevation={24} sx={{ width: '100%' }}>
            <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
              Tags Manager
            </DialogTitle>
            <DialogContent>
              <CreateTagForm onCreate={createTag} />
              <List
                dense
                sx={{
                  width: '100%',
                  maxHeight: '300px',
                  overflow: 'auto',
                  scrollbarWidth: 'none',
                  scrollbarColor: 'transparent transparent',
                }}
              >
                {sortedTags(tags.tags, SortType.ByName).map((tag) => {
                  return editItem === tag.id ? (
                    <EditTagForm tag={tag} onEdit={editTag} />
                  ) : (
                    <EditModeTagListItem
                      key={generateItemKey(tag.name, tag.id)}
                      tag={tag}
                      onEdit={setEditItem}
                      onDelete={deleteTag}
                    />
                  );
                })}
              </List>
            </DialogContent>
            <DialogActions>
              <Button>New</Button>
              <Button onClick={handleManage}>Done</Button>
            </DialogActions>
          </Paper>
        </Slide>
      </Box>
    </Dialog>
  );
});
