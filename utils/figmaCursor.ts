interface Position {
    x: number
    y: number
}

interface ScrollOffset {
    x: number
    y: number
}

export interface MousePressOrReleaseMessage {
    type: 'MOUSE_PRESS_OR_RELEASE'
    data: {
        // If there are overlays showing, this is the node id of the
        // topmost overlay on screen. If there are no overlays showing
        // it's the id of the screen we're showing.
        presentedNodeId: string
    
        // Whether or not the user clicked a hotspot.
        handled: boolean
    
        // When this event isn't handled, this is the topmost
        // layer under the cursor.
        targetNodeId: string
    
        // Position relative to the top left corner of the target node;
        // this is unaffected by whether the target node is a scrolling
        // frame and has been scrolled.
        targetNodeMousePosition: Position
    
        // The nested-most scrolling frame enclosing the targetNode, or
        // the targetNode if it scrolls.
        nearestScrollingFrameId: string
    
        // Position relative to the top left corner of the scrolling frame;
        // this is unaffected by whether the target node is a scrolling
        // frame and has been scrolled.
        nearestScrollingFrameMousePosition: Position
    
        // The scroll offset of the above scrolling frame. If the target
        // node is a scrolling frame, you can use this and targetNodeLocation
        // to find where the click happened in the layer content bounds.
        nearestScrollingFrameOffset: ScrollOffset
    }
}