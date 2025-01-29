import { useState, ChangeEvent, FormEvent } from 'react'
import { Button, Input, Select, Textarea } from '../../atoms'
import { IMessage } from '../../../interfaces/components'

interface OpenConnectionModalProps {
  showModal: boolean
  maxZIndex: number
  message?: IMessage
  onSubmitConnection: (e: FormEvent<HTMLFormElement>) => void
  onCancel: () => void
  handleFileToText: (e: ChangeEvent<HTMLInputElement>) => void
}

function OpenConnectionModal({
  showModal,
  maxZIndex,
  message,
  onSubmitConnection,
  onCancel,
  handleFileToText,
}: Readonly<OpenConnectionModalProps>) {
  const [authMethod, setAuthMethod] = useState<'password' | 'privateKey'>(
    'password'
  )

  return (
    <div
      className={`fixed inset-0 flex transform items-center justify-center p-28 transition-transform duration-300 ease-out ${
        showModal ? 'translate-x-0' : '-translate-x-[99rem]'
      }`}
      style={{
        zIndex: maxZIndex + 2,
      }}
    >
      <div className="flex max-h-full w-full max-w-md flex-col gap-4 rounded-xl bg-white/10 bg-clip-padding p-8 text-white backdrop-blur-xl backdrop-filter">
        <h1 className="text-center text-2xl font-bold">Open Connection</h1>

        {message && (
          <div
            className={`rounded-md ${
              message.type === 'error' ? 'bg-red-500/20' : 'bg-sky-500/20'
            } p-2 text-sm ${
              message.type === 'error' ? 'text-red-100' : 'text-sky-100'
            }`}
          >
            {message.content}
          </div>
        )}

        <form
          className="flex h-full flex-col gap-2 overflow-y-auto px-2 py-2"
          onSubmit={onSubmitConnection}
        >
          <Input
            id="host"
            name="host"
            text="Host"
            type="text"
            variant="translucent"
          />
          <Input
            id="port"
            name="port"
            text="Port"
            type="number"
            variant="translucent"
            defaultValue={22}
          />
          <Input
            id="user"
            name="user"
            text="User"
            type="text"
            variant="translucent"
          />

          <Select
            id="authMethod"
            name="authMethod"
            text="Authentication Method"
            options={[
              { value: 'password', label: 'Password' },
              { value: 'privateKey', label: 'Private Key' },
            ]}
            onChange={(e) =>
              setAuthMethod(e.target.value as 'password' | 'privateKey')
            }
            styleOptions={{
              color: 'black',
            }}
            variant="translucent"
          />

          {authMethod === 'password' ? (
            <Input
              id="password"
              name="password"
              text="Password"
              type="password"
              variant="translucent"
            />
          ) : (
            <div>
              <Textarea
                id="privateKey"
                name="privateKey"
                text="Private Key"
                variant="translucent"
              />
              <Input
                id="privateKeyFile"
                name="privateKeyFile"
                text="Private Key File"
                type="file"
                variant="translucent"
                onChange={handleFileToText}
              />
            </div>
          )}

          <div className="mt-2 flex w-full justify-between gap-2">
            <Button type="submit" variant="primary">
              Connect
            </Button>
            <Button type="button" variant="danger" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export { OpenConnectionModal }
