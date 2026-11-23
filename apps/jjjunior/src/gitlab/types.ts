/** A board card. Board lists are work item statuses, not labels. */
export type Issue = {
  gid: string;
  iid: number;
  project: string; // full path, e.g. my-group/subgroup/my-project
  title: string;
  description: string;
  status: string | null;
  webUrl: string;
};

export type Project = {
  id: number;
  path_with_namespace: string;
  ssh_url_to_repo: string;
  default_branch: string;
};

export type Note = {
  body: string;
  system: boolean;
  author: { username: string };
  created_at: string;
  resolved?: boolean;
  position?: { new_path: string; new_line: number | null; old_path: string; old_line: number | null };
  /** Where the note was left, e.g. "MR src/a.ts:12"; unset for issue comments. */
  where?: string;
};

export type Pipeline = { id: number; status: string; web_url: string };
