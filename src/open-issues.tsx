import { MenuBarExtra, open } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { personalAccessToken } from "./preferences";
import { Response } from "./types";

export default function Command() {
  const { data, isLoading } = useFetch<Response>(
    "https://api.github.com/search/issues?" + new URLSearchParams({ q: "is:issue mentions:leerob archived:false" }),
    {
      headers: { Accept: "application/vnd.github+json", Authorization: `Bearer ${personalAccessToken}` },
    }
  );

  return (
    <MenuBarExtra icon="lee.png" isLoading={isLoading}>
      {data?.items.map((issue) => (
        <MenuBarExtra.Item key={issue.number} title={issue.title} onAction={() => open(issue.html_url)} />
      ))}
    </MenuBarExtra>
  );
}
