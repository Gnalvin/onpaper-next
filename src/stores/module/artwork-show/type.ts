import type { IBaseArtwork, channelQuery } from '@/service/artwork/type'

export interface IArtworkShowState {
  artworks: IBaseArtwork[]
  loading: boolean
  isEnd: boolean
  query: channelQuery
}

export type { IBaseArtwork }
