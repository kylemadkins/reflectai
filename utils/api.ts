const createUrl = (path: string) => window.location.origin + path;

export const createEntry = async (): Promise<{ id: string }> => {
  const res = await fetch(
    new Request(createUrl("/api/journal"), {
      method: "POST",
    })
  );

  if (res.ok) {
    const json = await res.json();
    return json.data;
  }

  throw new Error();
};

export const updateEntry = async (
  id: string,
  content: string
): Promise<{ id: string }> => {
  const res = await fetch(
    new Request(createUrl(`/api/journal/${id}`), {
      method: "PATCH",
      body: JSON.stringify({ content }),
    })
  );

  if (res.ok) {
    const json = await res.json();
    return json.data;
  }

  throw new Error();
};
