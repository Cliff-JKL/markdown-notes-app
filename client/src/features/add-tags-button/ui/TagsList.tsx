import {
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import * as React from 'react';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import EditIcon from '@mui/icons-material/Edit';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { Tag } from 'shared/api';

interface TagsListProps {
  checkedTags: Tag[];
  onSetChecked: (checked: Tag[]) => void;
  tags: Tag[];
  editMode: boolean;
  onDelete: (tagId: string) => void;
}

export const TagsList = (props: TagsListProps) => {
  const { checkedTags, onSetChecked, tags, editMode, onDelete } = props;

  const [checked, setChecked] = React.useState(checkedTags);

  const handleToggle = (value: Tag) => () => {
    const currentIndex = checked.map((c) => c.id).indexOf(value.id);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    onSetChecked(newChecked);
  };

  const editTag = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    tag: Tag,
  ) => {};

  // const deleteTag = (
  //   event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  //   tagId: string,
  // ) => {};

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

  const sortedTags = (items: Tag[]) => {
    return items.slice().sort(compareTags);
  };

  console.count('TagsList');
  return (
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
      {sortedTags(tags).map((tag) => {
        const labelId = `checkbox-list-label-${tag.name}`;

        return !editMode ? (
          <ListItem
            key={tag.name}
            secondaryAction={
              <Checkbox
                edge="end"
                onChange={handleToggle(tag)}
                // FIXME ??
                checked={checked.map((c) => c.id).includes(tag.id)}
                inputProps={{ 'aria-labelledby': labelId }}
              />
            }
            disablePadding
          >
            <ListItemButton>
              <ListItemIcon>
                {checked.map((c) => c.id).includes(tag.id) ? (
                  <LocalOfferIcon />
                ) : (
                  <LocalOfferOutlinedIcon />
                )}
              </ListItemIcon>
              <ListItemText id={labelId} primary={tag.name} />
            </ListItemButton>
          </ListItem>
        ) : (
          <ListItem
            key={tag.name}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="edit"
                onClick={(event) => editTag(event, tag)}
              >
                <EditIcon />
              </IconButton>
            }
            disablePadding
          >
            <ListItemAvatar>
              <IconButton onClick={(event) => onDelete(tag.id)}>
                <RemoveCircleIcon color="error" />
              </IconButton>
            </ListItemAvatar>
            <ListItemText id={labelId} primary={tag.name} />
          </ListItem>
        );
      })}
    </List>
  );
};
