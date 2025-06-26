import "../../App.css";

export default function Login1(props: any) {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "100vh", background: "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)" }}>
      <form
        className="border shadow-lg bg-white"
        style={{
          width: 350,
          borderRadius: 16,
          overflow: "hidden", 
        }}
        onSubmit={props.handleSubmit}
      >
        <div
          className="d-flex justify-content-center align-items-center"
          style={{
            background: "linear-gradient(90deg, #6dd5ed 0%, #2193b0 100%)",
            borderBottom: "1px solid #e3e3e3",
            padding: "1.5rem 0",
          }}
        >
          <h3 className="fs-4 fw-semibold text-white mb-0">Sign in</h3>
        </div>
        <div className="d-flex flex-column gap-4 p-4 align-items-center">
          <div className="w-100">
            <input
              type="email"
              className="form-control bg-light border-0 shadow-sm px-3 py-2"
              name="email_id"
              placeholder="Email"
              style={{ borderRadius: 8, fontSize: 16 }}
              onChange={(e) =>
                props.setFormData({ ...(props.formData), [e.target.name]: e.target.value })
              }
            />
          </div>
          <div className="w-100">
            <input
              type="password"
              className="form-control bg-light border-0 shadow-sm px-3 py-2"
              name="password"
              placeholder="Enter Password"
              style={{ borderRadius: 8, fontSize: 16 }}
              onChange={(e) =>
                props.setFormData({ ...(props.formData), [e.target.name]: e.target.value })
              }
            />
          </div>
          <div className="w-100">
            <button
              type="submit"
              className="btn w-100 text-white fw-semibold"
              style={{
                background: "linear-gradient(90deg, #2193b0 0%, #6dd5ed 100%)",
                fontSize: 18,
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(33,147,176,0.08)",
                transition: "background 0.2s",
              }}
              // disabled={!props.isEmailValid() || !props.isPasswordValid()}
            >
              Login
            </button>
          </div>
          {props.error && (
            <div className="fs-6 text-danger text-center w-100">{props.error}</div>
          )}
          <div className="fs-6 d-flex flex-column align-items-center mt-2">
            <p className="mb-0">
              Don't have an account?{" "}
              <a href="/signup" className="text-decoration-none fw-semibold" style={{ color: "#2193b0" }}>
                Click Me
              </a>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};