import React from "react";
import { Typography } from "@mui/material";
import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "@/app/api/postApi";
import FormDialog from "@/app/content/components/FormDialog";

type PostDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  postId: number;
};

type ErrorResponse = {
  message: string;
};
const PostDialog: React.FC<PostDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  postId,
}) => {
  const queryClient = useQueryClient();

  // Mutation for updating a task
  const { mutateAsync: deletePostInfo } = useMutation({
    mutationFn: deletePost,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      onConfirm();
      onClose();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error(error.response?.data?.message || "Error deleting a post");
    },
  });
  // Handle confirm action (Create or Update)
  const handleConfirm = async () => {
    await deletePostInfo(postId);
  };

  return (
    <FormDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Post"
      onConfirm={handleConfirm}
    >
      <Typography variant="body1">Are you sure to delete a post? </Typography>
    </FormDialog>
  );
};

export default PostDialog;
