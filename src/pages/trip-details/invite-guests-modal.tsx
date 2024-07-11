import { Mail, User, X } from "lucide-react";
import { Button } from "../../components/button";
import { useParams } from "react-router-dom";
import { FormEvent, useEffect, useState } from "react";
import { Trip } from "./destination-and-date-header";
import { api } from "../../lib/axios";
import { format } from "date-fns";

interface InviteGuestsModalProps {
  closeInviteGuestsModal: () => void;
}

export function InviteGuestsModal({
  closeInviteGuestsModal,
}: InviteGuestsModalProps) {
  const { tripId } = useParams();
  const [trip, setTrip] = useState<Trip | undefined>();
  const [error, setError] = useState<string | null>(null);

  const displayedDateStarts = trip ? format(trip?.starts_at, "d") : null;
  const displayedDateEnds = trip
    ? format(trip?.ends_at, "d' de 'LLL' de 'yyyy")
    : null;

  useEffect(() => {
    api.get(`/trips/${tripId}`).then((response) => setTrip(response.data.trip));
  }, [tripId]);

  function errorMapping(data: any) {
    if (data.errors.email) {
      return "E-mail inválido.";
    } else {
      return "Um erro aconteceu, tente de novo!";
    }
  }

  async function addPeople(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const email = data.get("email")?.toString();

    try {
      await api.post(`/trips/${tripId}/invites`, {
        email,
      });
      window.document.location.reload();
    } catch (err: any) {
      const finalError = errorMapping(err.response.data);
      setError(finalError);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="w-[440px] md:w-[640px] rounded-xl py-5 px-6 shadow-shape bg bg-zinc-900 space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Confirmar participação</h2>
            <button type="button" onClick={closeInviteGuestsModal}>
              <X className="size-5 text-zinc-400" />
            </button>
          </div>
          <p className="text-sm text-zinc-400">
            Você foi convidado(a) para participar de uma viagem para
            <span className="font-semibold text-zinc-100">
              {" "}
              {trip?.destination}
            </span>{" "}
            nas datas de{" "}
            <span className="font-semibold text-zinc-100">
              {displayedDateStarts}
            </span>{" "}
            até{" "}
            <span className="font-semibold text-zinc-100">
              {displayedDateEnds}
            </span>
            .
          </p>
          <p className="text-sm text-zinc-400">
            Para confirmar sua presença na viagem, preencha os dados abaixo:
          </p>
        </div>

        <form onSubmit={addPeople} className="space-y-3">
          <div className="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
            <User className="size-5 text-zinc-400" />
            <input
              name="nome"
              placeholder="Seu nome completo"
              className="bg-transparent text-lg placeholder:text-zinc-400 outline-none flex-1"
            />
          </div>

          <div className="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
            <Mail className="size-5 text-zinc-400" />
            <input
              type="email"
              name="email"
              placeholder="Seu e-mail"
              className="bg-transparent text-lg placeholder:text-zinc-400 outline-none flex-1"
            />
          </div>

          {error && <p className="text-red-400">{error}</p>}

          <Button variant="primary" size="full">
            Confirmar minha presença
          </Button>
        </form>
      </div>
    </div>
  );
}
