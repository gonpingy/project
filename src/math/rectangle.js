/**
 * See LICENSE file.
 *
 * Rectangle Class.
 * Needed to compute Curve bounding box.
 * Needed to compute Actor affected area on change.
 *
 **/


(function() {
    /**
     * A Rectangle implementation, which defines an area positioned somewhere.
     *
     * @constructor
     */
	CAAT.Rectangle= function() {
		return this;
	};
	
	CAAT.Rectangle.prototype= {
		x:		0,
		y:		0,
		x1:		0,
		y1:		0,
		width:	-1,
		height:	-1,

        setEmpty : function() {
            this.width=     -1;
            this.height=    -1;
            this.x=         0;
            this.y=         0;
            this.x1=        0;
            this.y1=        0;
            return this;
        },
        /**
         * Set this rectangle's location.
         * @param x {number}
         * @param y {number}
         */
        setLocation: function( x,y ) {
            this.x= x;
            this.y= y;
            this.x1= this.x+this.width;
            this.y1= this.y+this.height;
            return this;
        },
        /**
         * Set this rectangle's dimension.
         * @param w {number}
         * @param h {number}
         */
        setDimension : function( w,h ) {
            this.width= w;
            this.height= h;
            this.x1= this.x+this.width;
            this.y1= this.y+this.height;
            return this;
        },
        setBounds : function( x,y,w,h ) {
            this.setLocation( x, y )
            this.setDimension( w, h );
            return this;
        },
        /**
         * Return whether the coordinate is inside this rectangle.
         * @param px {number}
         * @param py {number}
         *
         * @return {boolean}
         */
		contains : function(px,py) {
			return px>=0 && px<this.width && py>=0 && py<this.height; 
		},
        /**
         * Return whether this rectangle is empty, that is, has zero dimension.
         * @return {boolean}
         */
		isEmpty : function() {
			return this.width===-1 && this.height===-1;
		},
        /**
         * Set this rectangle as the union of this rectangle and the given point.
         * @param px {number}
         * @param py {number}
         */
		union : function(px,py) {
			
			if ( this.isEmpty() ) {
				this.x= px;
                this.x1= px;
				this.y= py;
                this.y1= py;
                this.width=0;
                this.height=0;
				return;
			}
			
			this.x1= this.x+this.width;
			this.y1= this.y+this.height;
			
			if ( py<this.y ) {
				this.y= py;
			}
			if ( px<this.x ) {
				this.x= px;
			}
			if ( py>this.y1 ) {
				this.y1= py;
			}
			if ( px>this.x1 ){
				this.x1= px;
			}
			
			this.width= this.x1-this.x;
			this.height= this.y1-this.y;
		},
        unionRectangle : function( rectangle ) {
            this.union( rectangle.x , rectangle.y  );
            this.union( rectangle.x1, rectangle.y  );
            this.union( rectangle.x,  rectangle.y1 );
            this.union( rectangle.x1, rectangle.y1 );
            return this;
        },
        intersects : function( r ) {
            if ( r.isEmpty() || this.isEmpty() ) {
                return false;
            }

            if ( r.x1<= this.x ) {
                return false;
            }
            if ( r.x >= this.x1 ) {
                return false;
            }
            if ( r.y1<= this.y ) {
                return false;
            }
            if ( r.y>= this.y1 ) {
                return false;
            }

            return true;
        },

        intersectsRect : function( x,y,w,h ) {
            if ( -1===w || -1===h ) {
                return false;
            }

            var x1= x+w-1;
            var y1= y+h-1;

            if ( x1< this.x ) {
                return false;
            }
            if ( x > this.x1 ) {
                return false;
            }
            if ( y1< this.y ) {
                return false;
            }
            if ( y> this.y1 ) {
                return false;
            }

            return true;
        },

        intersect : function( i, r ) {
            if ( typeof r==='undefined' ) {
                r= new CAAT.Rectangle();
            }

            r.x= Math.max( this.x, i.x );
            r.y= Math.max( this.y, i.y );
            r.x1=Math.min( this.x1, i.x1 );
            r.y1=Math.min( this.y1, i.y1 );
            r.width= r.x1-r.x;
            r.height=r.y1-r.y;

            return r;
        }
	};
})();