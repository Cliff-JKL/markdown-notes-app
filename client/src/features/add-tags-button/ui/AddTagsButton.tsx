import { IconButton } from '@mui/material';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import { type Tag } from 'shared/api';
import { TagsDialog } from './TagsDialog';
import { useState } from 'react';

interface AddTagsButtonProps {
  tags: Tag[];
  updateTags: (items: Tag[]) => void;
}

export const AddTagsButton = (props: AddTagsButtonProps) => {
  const { tags, updateTags } = props;

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (checked: Tag[]) => {
    updateTags(checked);
    handleClose();
  };

  console.count('AddTagsButton');
  return (
    <>
      <IconButton aria-label="addTags" onClick={handleClickOpen}>
        <LocalOfferOutlinedIcon />
      </IconButton>
      <TagsDialog
        open={open}
        onClose={handleClose}
        items={tags}
        onSubmit={handleSubmit}
      />
    </>
  );
};
