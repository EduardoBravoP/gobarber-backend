import { container } from "tsyringe";
import DiskStorageProvider from "./implementations/DiskStorageProvider";
import IStorageProvider from "./models/IStorageProvider";
import S3StorageProvider from './implementations/S3StorageProvider'
import uploadConfig from "@config/upload";

const providers = {
    disk: DiskStorageProvider,
    s3: S3StorageProvider
}

container.registerSingleton<IStorageProvider>(
    'StorageProvider',
    providers[uploadConfig.driver]
)
