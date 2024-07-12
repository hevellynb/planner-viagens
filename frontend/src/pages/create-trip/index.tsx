import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { InviteGuestsModal } from './invite-guests-modal'
import { ConfirmTripModal } from './confirm-trip-modal'
import { DestinationAndDateStep } from './steps/destination-and-date-step'
import { InviteGuestsStep } from './steps/invite-guests-step'
import { DateRange } from 'react-day-picker'
import { api } from '../../lib/axios'

export function CreateTripPage() {
  const navigate = useNavigate()

  const [ isGuestInputOpen, setIsGuestInputOpen] = useState(false)
  const [ isGuestModalOpen, setIsGuestModalOpen] = useState(false)
  const [ isConfirmTripModalOpen, setIsConfirmTripModalOpen] = useState(false)

  const [ destination, setDestination] = useState('')
  const [ ownerName, setOwnerName] = useState('')
  const [ ownerEmail, setOwnerEmail] = useState('')
  const [ eventStartAndEndDates, setEventStartAndEndDates] = useState<DateRange | undefined>()

  const [ emailsToInvite, setEmailsToInvite] = useState([
    'hevellynbarros@gmail.com'
  ])

  function openGuestInput() {
    setIsGuestInputOpen(true)
  }

  function closeGuestInput() {
    setIsGuestInputOpen(false)
  }

  function openGuestModal() {
    setIsGuestModalOpen(true)
  }

  function closeGuestModal() {
    setIsGuestModalOpen(false)
  }

  function openConfirmTripModal() {
    setIsConfirmTripModalOpen(true)
  }

  function closeConfirmTripModal() {
    setIsConfirmTripModalOpen(false)
  }

  async function createTrip(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!destination){
      return
    }

    if (!eventStartAndEndDates?.from || !eventStartAndEndDates?.to) {
      return
    }

    if (emailsToInvite.length === 0) {
      return
    }

    if (!ownerName || !ownerEmail) {
      return
    }

    const response = await api.post('/trips', {
      destination,
      starts_at: eventStartAndEndDates.from,
      ends_at: eventStartAndEndDates.to,
      emails_to_invite: emailsToInvite,
      owner_name: ownerName,
      owner_email: ownerEmail
    })

    const { tripId } = response.data

    navigate(`/trips/${tripId}`)
  }

  function addNewEmailToInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const data = new FormData(event.currentTarget)
    const email = data.get('email')?.toString()

    
    if(!email) {
      return
    }

    if (emailsToInvite.includes(email)) {
      return
    }

    setEmailsToInvite([
      ...emailsToInvite,
      email
    ])

      event.currentTarget.reset()

  }

  function removeEmailFromInvite(emailToRemove: string) {
    const newEmailList = emailsToInvite.filter(email => email !== emailToRemove)

    setEmailsToInvite(newEmailList)
  }

  return (
    <div className="h-screen flex items-center justify-center bg-pattern bg-no-repeat bg-center">
      <div className="max-w-3xl w-full px-6 text-center space-y-10">
        <div className='flex flex-col items-center gap-3'>
          <img src="/logo.svg" alt="plann.er" />
          <p className="text-zinc-300">Convide seus amigos e planeje sua próxima viagem!</p>
        </div>

      <div className='space-y-4'>
      <DestinationAndDateStep 
        closeGuestInput={closeGuestInput}
        openGuestInput={openGuestInput}
        isGuestInputOpen={isGuestInputOpen}
        setDestination={setDestination}
        eventStartAndEndDates={eventStartAndEndDates}
        setEventStartAndEndDates={setEventStartAndEndDates}
      />

      {isGuestInputOpen && (
        <InviteGuestsStep 
        emailsToInvite={emailsToInvite}
        openConfirmTripModal={openConfirmTripModal}
        openGuestModal={openGuestModal}
        />
      )}
      </div>
      

      <p className="text-sm text-zinc-500">Ao planejar sua viagem pela plann.er você automaticamente concorda <br />
      com nossos <a href="#" className="text-zinc-300 underline">termos de uso</a> e <a href="#" className="text-zinc-300 underline">políticas de privacidade</a>.</p>
      </div>

      {isGuestModalOpen && (
       <InviteGuestsModal 
       emailsToInvite={emailsToInvite}
       addNewEmailToInvite={addNewEmailToInvite}
       closeGuestModal={closeGuestModal}
       removeEmailFromInvite={removeEmailFromInvite}
       />
      )}

      {isConfirmTripModalOpen && (
        <ConfirmTripModal
        closeConfirmTripModal={closeConfirmTripModal}
        createTrip={createTrip}
        setOwnerEmail={setOwnerEmail}
        setOwnerName={setOwnerName}
        />
      )}

      

    </div>
  )
}

