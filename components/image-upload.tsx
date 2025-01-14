"use client";
import { toast } from "@/hooks/use-toast";
import config from "@/lib/config";
import { IKImage, ImageKitProvider, IKUpload } from "imagekitio-next";
import Image from "next/image";
import { useRef, useState } from "react";

const {
  env: {
    imageKit: { publicKey, urlEndpoint },
  },
} = config;

const authenticator = async () => {
  const response = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`);

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Request failed with status ${response.status}: ${errorText}`,
    );
  }

  const data = await response.json();
  console.debug(data);
  const { signature, expire, token } = data;

  return { signature, expire, token };
  try {
  } catch (e: any) {
    throw new Error(`authentication request failed, ${e.message}`);
  }
};

interface IImamgeUpload {
  onFileChange: (filePath: string) => void;
}

const ImageUpload = ({ onFileChange }: IImamgeUpload) => {
  const uploadRef = useRef(null);
  const [file, setFile] = useState<{ filePath: string } | null>(null);

  const onError = (error: any) => {
    console.error(error);
    toast({
      title: "Image upload failed",
      description: "Your image could not be uploaded. Please try again",
      variant: "destructive",
    });
  };

  const onSuccess = (res: any) => {
    setFile(res);
    onFileChange(res.filePath);

    toast({
      title: "File uploaded successfully",
      description: `${res.filePath} uploaded successfully`,
    });
  };

  return (
    <ImageKitProvider
      publicKey={publicKey}
      authenticator={authenticator}
      urlEndpoint={urlEndpoint}
    >
      <IKUpload
        className="hidden"
        ref={uploadRef}
        onError={onError}
        onSuccess={onSuccess}
        fileName="test-upload.png"
      />

      <button
        className="upload-btn"
        onClick={(e) => {
          e.preventDefault();

          if (uploadRef.current) {
            // @ts-ignore
            uploadRef.current?.click();
          }
        }}
      >
        <Image
          src={`/icons/upload.svg`}
          alt="upload-icon"
          width={20}
          height={20}
          className="object-contain"
        />
        <p className="text-base text-light-100">Upload a File</p>
        {file && <p className="upload-filename">{file.filePath}</p>}
      </button>
      {file && (
        <IKImage
          alt={file.filePath}
          path={file.filePath}
          width={500}
          height={300}
        />
      )}
    </ImageKitProvider>
  );
};

export default ImageUpload;
