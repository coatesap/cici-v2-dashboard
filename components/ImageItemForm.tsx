import {Card, FormGroup, InputGroup, TextArea} from "@blueprintjs/core";
import {useRef, useState} from "react";
import {toSlug} from "@/lib/stringUtils";
import {debounce} from "@/lib/debounce";

interface ImageItemFormProps {
    item: Record<string, any>;
}

export const ImageItemForm = ({item}: ImageItemFormProps) => {

    const slugRef = useRef<HTMLInputElement>(null)
    const [slugManuallySet, setSlugManuallySet] = useState(false)
    const [previewUrl, setPreviewUrl] = useState(item.url || '')

    const isValidUrl = (value: string) => {
        try {
            new URL(value)
            return true
        } catch {
            return false
        }
    }

    const debouncedSetPreview = useRef(debounce((value: string) => {
        setPreviewUrl(isValidUrl(value) ? value : '')
    }, 500)).current

    const titleChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (slugRef.current && !item.slug && !slugManuallySet) {
            slugRef.current.value = toSlug(e.target.value)
        }
    }

    const slugChangeHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        setSlugManuallySet(e.currentTarget.value.trim() !== '')
    }

    return (<div className="w-full flex flex-row flex-wrap gap-6">
        <div className="w-[18rem]">
            <Card>
                <FormGroup
                    label="Title"
                    labelInfo="(required)"
                >
                    <InputGroup
                        name="title"
                        required={true}
                        defaultValue={item.title}
                        onChange={titleChangeHandler}
                    />
                </FormGroup>

                <FormGroup
                    label="Slug"
                    labelInfo="(required)"
                    helperText="Alphanumeric and hyphens only"
                >
                    <InputGroup
                        inputRef={slugRef}
                        name="slug"
                        required={true}
                        defaultValue={item.slug}
                        onKeyUp={slugChangeHandler}
                    />
                </FormGroup>

                <FormGroup
                    label="URL"
                    labelInfo="(required)"
                >
                    <InputGroup
                        name="url"
                        required={true}
                        defaultValue={item.url}
                        onChange={(e) => debouncedSetPreview(e.target.value.trim())}
                    />
                    {previewUrl &&
                        <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-2">
                            <img src={previewUrl} alt="Preview" className="w-full h-auto rounded"/>
                        </a>
                    }
                </FormGroup>
            </Card>
        </div>

        <div className="flex-1">
            <Card>
                <FormGroup
                    label="Description"
                    labelInfo="(required)"
                >
                    <TextArea
                        name="description"
                        className="min-w-full"
                        rows={7}
                        defaultValue={item.description}
                    />
                </FormGroup>

                <FormGroup
                    label="LLM Guidance"
                >
                    <TextArea
                        name="llmGuidance"
                        className="min-w-full"
                        rows={8}
                        defaultValue={item.llmGuidance}
                    />
                </FormGroup>
            </Card>
        </div>
    </div>)
}
