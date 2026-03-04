import {Card, FormGroup, InputGroup, TextArea} from "@blueprintjs/core";
import {useRef, useState} from "react";
import {toSlug} from "@/lib/stringUtils";

interface KnowledgeItemFormProps {
    item: Record<string, any>;
}

export const KnowledgeItemForm = ({item}: KnowledgeItemFormProps) => {

    const slugRef = useRef<HTMLInputElement>(null)
    const [slugManuallySet, setSlugManuallySet] = useState(false)

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

                <FormGroup label="Region">
                    <InputGroup
                        name="region"
                        defaultValue={item.region}
                    />
                </FormGroup>

                <FormGroup label="Audience">
                    <InputGroup
                        name="audience"
                        defaultValue={item.audience}
                    />
                </FormGroup>
            </Card>
        </div>

        <div className="flex-1">
            <Card>
                <FormGroup
                    label="Questions"
                    labelInfo="(required)"
                    helperText="One question per line"
                >
                    <TextArea
                        name="questions"
                        className="min-w-full"
                        rows={6}
                        defaultValue={item.questions}
                    />
                </FormGroup>

                <FormGroup
                    label="Body text"
                    labelInfo="(required)"
                >
                    <TextArea
                        name="bodyText"
                        className="min-w-full"
                        rows={10}
                        defaultValue={item.bodyText}
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
