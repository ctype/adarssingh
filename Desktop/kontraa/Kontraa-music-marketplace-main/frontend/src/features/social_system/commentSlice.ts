import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apolloClientMutate, apolloClientQuery } from "@/apollo/apolloHelper";

import { ADD_COMMENT, ADD_REPLY } from "@/graphql/mutation/social_system/comment.mutation";
import { FETCH_COMMENTS_BY_ID, FETCH_REPLIES } from "@/graphql/query/social_system/comment.query";

const initialState: IBaseSliceInitialState & {
  comments: CommentEntity[];
  isReplyFetching: boolean;
} = {
  comments: [],
  isReplyFetching: false,
  error: null,
  isPending: false,
}

export const fetchComments = createAsyncThunk(
  "comments/fetchComment",
  async ({ entityId, entityName }: { entityId: number, entityName: string }) => {
    return await apolloClientQuery(FETCH_COMMENTS_BY_ID, { entityId, entityName })
  }
);

export const createComment = createAsyncThunk(
  "comments/createComment",
  async ({ content, entityId, entityName }: { content: string, entityId: number, entityName: string }) => {
    return await apolloClientMutate(ADD_COMMENT, { content, entityId, entityName }, {}, { suppressGlobalError: true });
  }
);

export const createReply = createAsyncThunk(
  "comments/createReply",
  async ({ content, parentId }: { content: string, parentId: number }) => {
    return await apolloClientMutate(ADD_REPLY, { content, parentId }, {}, { suppressGlobalError: true });
  }
);

export const fetchReplies = createAsyncThunk(
  "comments/fetchReplies",
  async ({ parentId }: { parentId: number }) => {
    return await apolloClientQuery(FETCH_REPLIES, { parentId })
  }
);

const CommentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    setCommentsVoteCount(state, action) {
      const like = action.payload.data.like;

      if (!action.payload.data.isLiked) {
        state.comments = state.comments.map((c) => {
          if (c.id === like.entityId) {
            return {
              ...c,
              upVoteCount: c.upVoteCount - 1
            }
          }
          return {
            ...c,
            replies: c.replies.map((reply) => {
              if (reply.id === like.entityId) {
                return {
                  ...reply,
                  upVoteCount: reply.upVoteCount - 1,
                }
              }
              return reply;
            })
          }
        })
      } else {
        state.comments = state.comments.map((c) => {
          if (c.id === like.entityId) {
            return {
              ...c,
              upVoteCount: c.upVoteCount + 1
            }
          }
          return {
            ...c,
            replies: c.replies.map((reply) => {
              if (reply.id === like.entityId) {
                return {
                  ...reply,
                  upVoteCount: reply.upVoteCount + 1,
                }
              }
              return reply;
            })
          }
        })
      }
    },
    setComments(state, action) {
      state.comments = action.payload;
    }
  },
  extraReducers: (builder) => {
    return builder.addCase(fetchComments.pending, (state) => {
      state.isPending = true;
    }).addCase(fetchComments.fulfilled, (state, action) => {
      state.isPending = false;
      state.comments = action.payload.commentsById.map((c: dynamicObj) => ({ ...c, replies: [] }))
    })
      // .addCase(fetchComments.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(createComment.pending, (state) => {
        state.isPending = true;
      }).addCase(createComment.fulfilled, (state, action) => {
        state.isPending = false;
        state.comments = [action.payload.comment, ...state.comments];
      })
      // .addCase(createComment.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(createReply.pending, (state) => {
        state.isPending = true;
      }).addCase(createReply.fulfilled, (state, action) => {
        state.isPending = false;
        const reply = action.payload.reply;
        state.comments = state.comments.map((c) => {
          if (c.id === reply.parentId) {
            return {
              ...c,
              repliesCount: c.repliesCount + 1,
              replies: [reply, ...c.replies]
            }
          }
          return c;
        })
      })
      // .addCase(createReply.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(fetchReplies.pending, (state) => {
        state.isReplyFetching = true;
      }).addCase(fetchReplies.fulfilled, (state, action) => {
        state.isReplyFetching = false;
        const replies = action.payload.replies;
        state.comments = state.comments.map((c) => {
          if (c.id === replies[0].parentId) {
            return {
              ...c,
              replies: replies.map((r: dynamicObj) => ({
                ...r,
                replies: [],
              })),
            }
          }
          return c;
        })
      })
    // .addCase(fetchReplies.rejected, (state, action) => {
    //   state.isReplyFetching = false;
    //   state.error = action.error.message || null;
    // });
  }
});

export const { setComments, setCommentsVoteCount } = CommentSlice.actions;
export default CommentSlice.reducer;
