import { use, useEffect, useState } from "react";
import {
  Call,
  CallControls,
  CallingState,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import "./index.css";
import { Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export const MyUILayout = () => {
  const navigate = useNavigate();
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  useEffect(() => {
    if (callingState === "left") {
      navigate(-1);
    }
  }, [callingState]);

  if (callingState !== CallingState.JOINED) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <StreamTheme>
      <SpeakerLayout participantsBarPosition="bottom" />
      <CallControls />
    </StreamTheme>
  );
};

type Props = {
  data: {
    token: string;
    user: {
      id: string;
      name: string;
      image?: string;
    };
  };
};

const CallComponent = ({ data }: Props) => {
  const { lessonId } = useParams();
  const [client, setClient] = useState<StreamVideoClient>();
  const [call, setCall] = useState<Call>();

  useEffect(() => {
    const client = new StreamVideoClient({
      apiKey: import.meta.env.VITE_STREAM_API_KEY,
      user: data.user,
      token: data.token,
    });
    setClient(client);
    const call = client.call("default", lessonId || "default-call-id");
    setCall(call);
    call.join({ create: true });

    // Cleanup function
    return () => {
      if (call) {
        call.leave().catch((err) => console.error("Error leaving call:", err));
      }
      if (client) {
        client
          .disconnectUser()
          .catch((err) => console.error("Error disconnecting client:", err));
      }
    };
  }, [data]);

  return (
    <StreamVideo client={client!}>
      <StreamCall call={call}>
        <MyUILayout />
      </StreamCall>
    </StreamVideo>
  );
};

export default CallComponent;
