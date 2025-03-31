const createUrl = (path: string) => window.location.origin + path;

export const createEntry = async (): Promise<{ id: string } | undefined> => {
  const res = await fetch(
    new Request(createUrl("/api/journal"), {
      method: "POST",
    })
  );

  if (res.ok) {
    const json = await res.json();
    return json.data;
  }

  return;
};
