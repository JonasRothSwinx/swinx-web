const fileKeys = {
    all: ["analysisFiles"] as const,
    selected: () => [...fileKeys.all, "selected"] as const,
    folder: {
        all: (prefix: string) => [...fileKeys.all, "folder", prefix] as const,
        one: (key: string) => [...fileKeys.all, "file", key] as const,
    },
};

export const queryKeys = {
    files: fileKeys,
};
