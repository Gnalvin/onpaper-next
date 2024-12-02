export interface IUserInfo {
  userId: string
  userName: string
  avatar: string
  isFocus: 0 | 1 | 2
  artworks: ISimpleArtwork[]
  vStatus: number
  vTag: string
}

export interface ISimpleArtwork {
  artworkId: string
  userId: string
  cover: string
}
