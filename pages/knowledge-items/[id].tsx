import {Button, FocusStyleManager, Spinner} from '@blueprintjs/core'
import {useEffect, useState} from "react";
import Head from "next/head";
import Header from "@/components/Header";
import {extractFormData} from "@/lib/knowledgeItem";
import {ErrorBlock} from "@/lib/cms/error-block";
import {SuccessBlock} from "@/lib/cms/success-block";
import {KnowledgeItemForm} from "@/components/KnowledgeItemForm";
import {useRouter} from "next/router";
import ScreenHeader from "@/components/ScreenHeader";
import {withAdminUser} from "@/lib/auth";

FocusStyleManager.onlyShowFocusOnTabs();

const EditKnowledgeItem = () => {
    const router = useRouter()
    const {id} = router.query

    const [loading, setLoading] = useState(true)
    const [item, setItem] = useState<Record<string, any> | null>(null)
    const [errorMessages, setErrorMessages] = useState([])
    const [successMessage, setSuccessMessage] = useState('')

    useEffect(() => {
        if (!id) return
        fetch(`/api/knowledge-item?id=${id}`)
            .then(res => res.json())
            .then(({data, errors}) => {
                if (errors) {
                    setErrorMessages(errors)
                } else {
                    setItem(data)
                }
                setLoading(false)
            })
    }, [id])

    const save = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = new FormData(e.currentTarget)
        const data = extractFormData(form)

        fetch(`/api/update-knowledge-item?id=${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(res => res.json())
            .then(({data, errors}) => {
                setErrorMessages(errors ?? [])
                setSuccessMessage(errors ? '' : 'Knowledge item updated')
                if (!errors) {
                    setItem(data)
                }
            });
    }

    return (
        <div className="min-h-screen" style={{backgroundColor: '#E8E6E5'}}>
            <Head>
                <title>Edit Knowledge Item - CiCi Dashboard</title>
            </Head>
            <Header/>

            <div className="mx-auto max-w-6xl px-4 mt-4 pb-10">

                <ScreenHeader
                    backLink="/knowledge-items"
                    title={item ? `Edit: ${item.title}` : 'Edit Knowledge Item'}
                    rightSlot={
                        item &&
                        <Button
                            type="submit"
                            intent="primary"
                            icon="floppy-disk"
                            text="Save"
                            form="edit-knowledge-item-form"
                        />
                    }
                />

                {loading ? <Spinner/> :
                    <div>
                        <ErrorBlock errorMessages={errorMessages}/>
                        <SuccessBlock successMessage={successMessage}/>

                        {item &&
                            <form
                                id="edit-knowledge-item-form"
                                onSubmit={save}
                                action=""
                            >
                                <KnowledgeItemForm item={item}/>
                            </form>
                        }
                    </div>
                }
            </div>
        </div>
    )
}

export default withAdminUser(EditKnowledgeItem)
