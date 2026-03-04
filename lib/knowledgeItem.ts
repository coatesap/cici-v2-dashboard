import {makeEmptyStringNull} from "./stringUtils";

export const extractFormData = (form: FormData) => {
    return {
        slug: form.get('slug'),
        title: form.get('title'),
        region: makeEmptyStringNull(form.get('region')),
        audience: makeEmptyStringNull(form.get('audience')),
        questions: form.get('questions'),
        bodyText: form.get('bodyText'),
        llmGuidance: makeEmptyStringNull(form.get('llmGuidance')),
    }
}

export const createKnowledgeItemValidator = () => ({
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
    region: () => {},
    audience: () => {},
    questions: (v: unknown) => {
        if (typeof v !== 'string' || v.trim().length === 0) {
            throw new Error(`"Questions" cannot be empty`)
        }
    },
    bodyText: (v: unknown) => {
        if (typeof v !== 'string' || v.trim().length === 0) {
            throw new Error(`"Body text" cannot be empty`)
        }
    },
    llmGuidance: () => {},
})
