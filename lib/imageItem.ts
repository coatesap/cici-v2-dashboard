import {makeEmptyStringNull} from "./stringUtils";

export const extractFormData = (form: FormData) => {
    return {
        slug: form.get('slug'),
        title: form.get('title'),
        url: form.get('url'),
        description: form.get('description'),
        llmGuidance: makeEmptyStringNull(form.get('llmGuidance')),
    }
}

export const createImageItemValidator = () => ({
    slug: (v: unknown) => {
        if (typeof v !== 'string' || v.trim().length === 0) {
            throw new Error(`"Slug" cannot be empty`)
        }
        if (!v.match(/^[a-zA-Z0-9-]+$/)) {
            throw new Error(`"Slug" should contain only alphanumeric characters and hyphens`)
        }
    },
    title: (v: unknown) => {
        if (typeof v !== 'string' || v.trim().length === 0) {
            throw new Error(`"Title" cannot be empty`)
        }
    },
    url: (v: unknown) => {
        if (typeof v !== 'string' || v.trim().length === 0) {
            throw new Error(`"URL" cannot be empty`)
        }
        try {
            new URL(v);
        } catch (_) {
            throw new Error(`"URL" must be a valid URL`)
        }
    },
    description: (v: unknown) => {
        if (typeof v !== 'string' || v.trim().length === 0) {
            throw new Error(`"Description" cannot be empty`)
        }
    },
    llmGuidance: () => {},
})
