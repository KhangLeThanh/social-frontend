import React from "react";
import { Typography } from "@mui/material";
import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment } from "@/app/api/commentApi";
import FormDialog from "@/app/content/components/FormDialog";

type CommentDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  commentId: number;
};

type ErrorResponse = {
  message: string;
};
const CommentDialog: React.FC<CommentDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  commentId,
}) => {
  const queryClient = useQueryClient();

  // Mutation for updating a task
  const { mutateAsync: deleteCommentInfo } = useMutation({
    mutationFn: deleteComment,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      onConfirm();
      onClose();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error(
        error.response?.data?.message || "Error deleting a comment"
      );
    },
  });
  // Handle confirm action (Create or Update)
  const handleConfirm = async () => {
    await deleteCommentInfo(commentId);
  };

  return (
    <FormDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Comment"
      onConfirm={handleConfirm}
    >
      <Typography variant="body1">
        Are you sure to delete a comment?{" "}
      </Typography>
    </FormDialog>
  );
};

export default CommentDialog;
