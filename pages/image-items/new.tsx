import {Button, FocusStyleManager} from '@blueprintjs/core'
import {useState} from "react";
import Head from "next/head";
import Header from "@/components/Header";
import {extractFormData} from "@/lib/imageItem";
import {ErrorBlock} from "@/lib/cms/error-block";
import {SuccessBlock} from "@/lib/cms/success-block";
import {ImageItemForm} from "@/components/ImageItemForm";
import {useRouter} from "next/router";
import ScreenHeader from "@/components/ScreenHeader";
import {withAdminUser} from "@/lib/auth";

FocusStyleManager.onlyShowFocusOnTabs();

const NewImageItem = () => {
    const router = useRouter()

    const [errorMessages, setErrorMessages] = useState([])
    const [successMessage, setSuccessMessage] = useState('')
    const [saved, setSaved] = useState(false)

    const save = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = new FormData(e.currentTarget)
        const data = extractFormData(form)

        fetch(`/api/add-image-item`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(res => res.json())
            .then(({errors}) => {
                setErrorMessages(errors ?? [])
                setSuccessMessage(errors ? '' : 'Image item successfully added')
                if (!errors) {
                    setSaved(true)
                    setTimeout(() => {
                        router.push('/image-items')
                    }, 1500)
                }
            });
    }

    return (
        <div className="min-h-screen" style={{backgroundColor: '#E8E6E5'}}>
            <Head>
                <title>Add Image Item - CiCi Dashboard</title>
            </Head>
            <Header/>

            <div className="mx-auto max-w-6xl px-4 mt-4 pb-10">

                <ScreenHeader
                    backLink="/image-items"
                    title="Add Image Item"
                    rightSlot={
                        !saved &&
                        <Button
                            type="submit"
                            intent="primary"
                            icon="floppy-disk"
                            text="Save"
                            form="new-image-item-form"
                        />
                    }
                />

                <div>
                    <ErrorBlock errorMessages={errorMessages}/>
                    <SuccessBlock successMessage={successMessage}/>

                    {saved
                        ? <></>
                        : <form
                            id="new-image-item-form"
                            onSubmit={save}
                            action=""
                        >
                            <ImageItemForm item={{}}/>
                        </form>
                    }
                </div>
            </div>
        </div>
    )
}

export default withAdminUser(NewImageItem)
