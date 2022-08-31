import { Action, ActionPanel, Detail, Icon, Image, List } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { personalAccessToken } from "./preferences";
import { Issue, Response } from "./types";

export default function Command() {
  const { data, isLoading } = useFetch<Response>(
    "https://api.github.com/search/issues?" + new URLSearchParams({ q: "is:issue mentions:leerob archived:false" }),
    {
      headers: { Accept: "application/vnd.github+json", Authorization: `Bearer ${personalAccessToken}` },
    }
  );

  return (
    <List isLoading={isLoading}>
      {data?.items.map((issue) => (
        <List.Item
          key={issue.id}
          icon={issue.state === "open" ? Icon.Circle : Icon.CheckCircle}
          title={issue.title}
          subtitle={`#${issue.number}`}
          accessories={[
            { date: new Date(issue.updated_at), tooltip: `Updated: ${new Date(issue.updated_at).toLocaleString()}` },
            { icon: { source: issue.user?.avatar_url ?? Icon.PersonCircle, mask: Image.Mask.Circle } },
          ]}
          actions={<Actions issue={issue} />}
        />
      ))}
    </List>
  );
}

function IssueDetail(props: { issue: Issue }) {
  return <Detail markdown={props.issue.body} actions={<Actions issue={props.issue} isDetail />} />;
}

function Actions(props: { issue: Issue; isDetail?: boolean }) {
  return (
    <ActionPanel>
      {!props.isDetail && (
        <Action.Push icon={Icon.Sidebar} title="Show Details" target={<IssueDetail issue={props.issue} />} />
      )}
      <Action.OpenInBrowser url={props.issue.html_url} />
      <Action.CopyToClipboard title="Copy URL" content={props.issue.html_url} />
    </ActionPanel>
  );
}
